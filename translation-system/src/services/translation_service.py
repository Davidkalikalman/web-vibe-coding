"""
Translation Service for Multilingual Text Management System

Provides multiple translation backends with caching, retry logic,
and formatting preservation for various text types.
"""

import re
import time
import json
import logging
import hashlib
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
from dataclasses import dataclass
from abc import ABC, abstractmethod

# Translation libraries
from deep_translator import GoogleTranslator as DeepGoogleTranslator
from deep_translator import DeeplTranslator

# Optional advanced services
try:
    import openai

    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

from core.config_manager import ConfigManager, TranslationConfig


@dataclass
class TranslationResult:
    """Result of translation operation"""

    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    service_used: str
    confidence: float = 0.0
    processing_time: float = 0.0
    cached: bool = False
    error_message: Optional[str] = None


class BaseTranslator(ABC):
    """Abstract base class for translation services"""

    def __init__(self, config: TranslationConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)

    @abstractmethod
    def translate(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> TranslationResult:
        """Translate text to target language"""
        pass

    @abstractmethod
    def detect_language(self, text: str) -> str:
        """Detect language of text"""
        pass


class GoogleTranslationService(BaseTranslator):
    """Google Translate service implementation using deep-translator"""

    def __init__(self, config: TranslationConfig):
        super().__init__(config)
        # Use deep-translator as primary
        self.translator = DeepGoogleTranslator(source="auto", target="en")

    def translate(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> TranslationResult:
        """Translate text using Google Translate via deep-translator"""
        start_time = time.time()

        try:
            # Configure translator for this request
            self.translator.source = source_language or "auto"
            self.translator.target = target_language

            translated = self.translator.translate(text)
            processing_time = time.time() - start_time

            return TranslationResult(
                original_text=text,
                translated_text=translated,
                source_language=source_language or "auto",
                target_language=target_language,
                service_used="google",
                confidence=0.8,
                processing_time=processing_time,
            )

        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"Google Translate failed: {e}"

            return TranslationResult(
                original_text=text,
                translated_text="",
                source_language=source_language or "unknown",
                target_language=target_language,
                service_used="google_failed",
                processing_time=processing_time,
                error_message=error_msg,
            )

    def detect_language(self, text: str) -> str:
        """Detect language using deep-translator"""
        try:
            # deep-translator doesn't have direct detection, return auto
            return "auto"
        except Exception as e:
            self.logger.warning(f"Language detection failed: {e}")
            return "unknown"


class DeepLTranslationService(BaseTranslator):
    """DeepL translation service implementation"""

    def __init__(self, config: TranslationConfig):
        super().__init__(config)
        if not config.api_key:
            raise ValueError("DeepL API key is required")

        self.translator = DeeplTranslator(api_key=config.api_key)

    def translate(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> TranslationResult:
        """Translate text using DeepL"""
        start_time = time.time()

        try:
            translated = self.translator.translate(text, target_language)
            processing_time = time.time() - start_time

            return TranslationResult(
                original_text=text,
                translated_text=translated,
                source_language=source_language or "auto",
                target_language=target_language,
                service_used="deepl",
                confidence=0.9,  # DeepL generally high quality
                processing_time=processing_time,
            )

        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"DeepL translation failed: {e}"

            return TranslationResult(
                original_text=text,
                translated_text="",
                source_language=source_language or "unknown",
                target_language=target_language,
                service_used="deepl_failed",
                processing_time=processing_time,
                error_message=error_msg,
            )

    def detect_language(self, text: str) -> str:
        """DeepL doesn't have built-in detection, use Google as fallback"""
        try:
            google = GoogleTranslationService(self.config)
            return google.detect_language(text)
        except Exception:
            return "unknown"


class OpenAITranslationService(BaseTranslator):
    """OpenAI GPT-based translation service"""

    def __init__(self, config: TranslationConfig):
        super().__init__(config)
        if not OPENAI_AVAILABLE:
            raise ImportError("OpenAI library not available")
        if not config.api_key:
            raise ValueError("OpenAI API key is required")

        openai.api_key = config.api_key

    def translate(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> TranslationResult:
        """Translate text using OpenAI GPT"""
        start_time = time.time()

        try:
            # Create translation prompt
            prompt = self._create_translation_prompt(text, target_language, source_language)

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional translator."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=2000,
                temperature=0.1,
            )

            translated_text = response.choices[0].message.content.strip()
            processing_time = time.time() - start_time

            return TranslationResult(
                original_text=text,
                translated_text=translated_text,
                source_language=source_language or "auto",
                target_language=target_language,
                service_used="openai",
                confidence=0.85,
                processing_time=processing_time,
            )

        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"OpenAI translation failed: {e}"

            return TranslationResult(
                original_text=text,
                translated_text="",
                source_language=source_language or "unknown",
                target_language=target_language,
                service_used="openai_failed",
                processing_time=processing_time,
                error_message=error_msg,
            )

    def _create_translation_prompt(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> str:
        """Create translation prompt for OpenAI"""
        lang_names = {
            "sk": "Slovak",
            "en": "English",
            "hu": "Hungarian",
            "de": "German",
            "pl": "Polish",
        }

        target_lang_name = lang_names.get(target_language, target_language)
        source_info = (
            f" from {lang_names.get(source_language, source_language)}" if source_language else ""
        )

        return f"""Translate the following text{source_info} to {target_lang_name}. 
Preserve all formatting, HTML tags, and special characters. 
Provide only the translation without any additional explanation.

Text to translate:
{text}"""

    def detect_language(self, text: str) -> str:
        """Detect language using OpenAI"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a language detection expert."},
                    {
                        "role": "user",
                        "content": f"What language is this text written in? Respond with only the language code (en, sk, hu, de, pl, etc.): {text[:200]}",
                    },
                ],
                max_tokens=10,
                temperature=0,
            )

            return response.choices[0].message.content.strip().lower()
        except Exception:
            return "unknown"


class TranslationCache:
    """Simple file-based cache for translations"""

    def __init__(self, cache_dir: str = "cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.cache_file = self.cache_dir / "translations.json"
        self.cache = self._load_cache()
        self.logger = logging.getLogger(__name__)

    def _load_cache(self) -> Dict[str, Any]:
        """Load cache from file"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                self.logger.warning(f"Could not load translation cache: {e}")
        return {}

    def _save_cache(self) -> None:
        """Save cache to file"""
        try:
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(self.cache, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.logger.warning(f"Could not save translation cache: {e}")

    def _get_cache_key(self, text: str, target_language: str, source_language: str = "auto") -> str:
        """Generate cache key for text and language pair"""
        content = f"{text}|{source_language}|{target_language}"
        return hashlib.md5(content.encode()).hexdigest()

    def get(self, text: str, target_language: str, source_language: str = "auto") -> Optional[str]:
        """Get cached translation"""
        key = self._get_cache_key(text, target_language, source_language)
        return self.cache.get(key)

    def set(
        self, text: str, target_language: str, translation: str, source_language: str = "auto"
    ) -> None:
        """Cache translation"""
        key = self._get_cache_key(text, target_language, source_language)
        self.cache[key] = translation
        self._save_cache()


class FormattingPreserver:
    """Preserve formatting during translation"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

        # Patterns to preserve
        self.preserve_patterns = [
            (r"(<[^>]+>)", "HTML_TAG"),  # HTML tags
            (r"(\{[^}]+\})", "PLACEHOLDER"),  # Template placeholders
            (r"(\[[^\]]+\])", "BRACKET"),  # Markdown links
            (r"(\*\*[^*]+\*\*)", "BOLD"),  # Bold markdown
            (r"(\*[^*]+\*)", "ITALIC"),  # Italic markdown
            (r"(`[^`]+`)", "CODE"),  # Code markdown
            (r"(https?://[^\s]+)", "URL"),  # URLs
            (r"(\w+@\w+\.\w+)", "EMAIL"),  # Email addresses
        ]

    def extract_formatting(self, text: str) -> Tuple[str, Dict[str, str]]:
        """Extract formatting elements and return clean text with mapping"""
        placeholders = {}
        clean_text = text

        for i, (pattern, prefix) in enumerate(self.preserve_patterns):
            matches = re.finditer(pattern, clean_text)
            for j, match in enumerate(matches):
                original = match.group(1)
                placeholder = f"___{prefix}_{i}_{j}___"
                placeholders[placeholder] = original
                clean_text = clean_text.replace(original, placeholder, 1)

        return clean_text, placeholders

    def restore_formatting(self, translated_text: str, placeholders: Dict[str, str]) -> str:
        """Restore formatting elements in translated text"""
        result = translated_text

        for placeholder, original in placeholders.items():
            result = result.replace(placeholder, original)

        return result


class TranslationService:
    """Main translation service with multiple backends and caching"""

    def __init__(self, config_manager: ConfigManager):
        """
        Initialize translation service

        Args:
            config_manager: Configuration manager instance
        """
        self.config = config_manager.translation_config
        self.logger = logging.getLogger(__name__)

        # Initialize cache if enabled
        self.cache = TranslationCache() if self.config.cache_enabled else None

        # Initialize formatting preserver
        self.formatter = FormattingPreserver()

        # Initialize translator based on service
        self.translator = self._create_translator()

    def _create_translator(self) -> BaseTranslator:
        """Create translator instance based on configuration"""
        service = self.config.service.lower()

        if service == "google":
            return GoogleTranslationService(self.config)
        elif service == "deepl":
            return DeepLTranslationService(self.config)
        elif service == "openai" and OPENAI_AVAILABLE:
            return OpenAITranslationService(self.config)
        else:
            self.logger.warning(f"Unknown service '{service}', falling back to Google")
            return GoogleTranslationService(self.config)

    def translate_text(
        self, text: str, target_language: str, source_language: Optional[str] = None
    ) -> TranslationResult:
        """
        Translate text with caching and retry logic

        Args:
            text: Text to translate
            target_language: Target language code
            source_language: Source language code (auto-detect if None)

        Returns:
            TranslationResult: Translation result
        """
        if not text or not text.strip():
            return TranslationResult(
                original_text=text,
                translated_text=text,
                source_language=source_language or "unknown",
                target_language=target_language,
                service_used="no_translation_needed",
                confidence=1.0,
            )

        # Check cache first
        if self.cache:
            cached_translation = self.cache.get(text, target_language, source_language or "auto")
            if cached_translation:
                return TranslationResult(
                    original_text=text,
                    translated_text=cached_translation,
                    source_language=source_language or "auto",
                    target_language=target_language,
                    service_used=self.config.service,
                    confidence=0.9,
                    cached=True,
                )

        # Extract formatting if enabled
        clean_text = text
        placeholders = {}

        if self.config.preserve_formatting:
            clean_text, placeholders = self.formatter.extract_formatting(text)

        # Translate with retry logic
        last_error = None
        for attempt in range(self.config.max_retries):
            try:
                result = self.translator.translate(clean_text, target_language, source_language)

                if result.error_message:
                    last_error = result.error_message
                    if attempt < self.config.max_retries - 1:
                        time.sleep(self.config.retry_delay * (attempt + 1))
                        continue
                    return result

                # Restore formatting
                if self.config.preserve_formatting and placeholders:
                    result.translated_text = self.formatter.restore_formatting(
                        result.translated_text, placeholders
                    )

                # Cache successful translation
                if self.cache and result.translated_text:
                    self.cache.set(
                        text, target_language, result.translated_text, result.source_language
                    )

                return result

            except Exception as e:
                last_error = str(e)
                if attempt < self.config.max_retries - 1:
                    self.logger.warning(f"Translation attempt {attempt + 1} failed: {e}")
                    time.sleep(self.config.retry_delay * (attempt + 1))
                else:
                    self.logger.error(f"All translation attempts failed: {e}")

        # Return failed result
        return TranslationResult(
            original_text=text,
            translated_text="",
            source_language=source_language or "unknown",
            target_language=target_language,
            service_used=self.config.service,
            error_message=f"Translation failed after {self.config.max_retries} attempts: {last_error}",
        )

    def translate_batch(
        self, texts: List[str], target_language: str, source_language: Optional[str] = None
    ) -> List[TranslationResult]:
        """
        Translate multiple texts

        Args:
            texts: List of texts to translate
            target_language: Target language code
            source_language: Source language code

        Returns:
            List[TranslationResult]: List of translation results
        """
        results = []

        for text in texts:
            result = self.translate_text(text, target_language, source_language)
            results.append(result)

            # Small delay between requests to avoid rate limiting
            if not result.cached:
                time.sleep(0.1)

        return results

    def detect_language(self, text: str) -> str:
        """Detect language of text"""
        try:
            return self.translator.detect_language(text)
        except Exception as e:
            self.logger.warning(f"Language detection failed: {e}")
            return "unknown"
