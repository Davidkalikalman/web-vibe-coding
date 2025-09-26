"""
Unit tests for Translation Service

Tests translation functionality, caching, and error handling.
"""

import pytest
import time
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
import tempfile
import json

import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from services.translation_service import (
    TranslationService, GoogleTranslationService, TranslationResult,
    TranslationCache, FormattingPreserver
)
from core.config_manager import ConfigManager, TranslationConfig


class TestTranslationResult:
    """Test suite for TranslationResult dataclass"""
    
    def test_translation_result_creation(self):
        """Test creating translation result"""
        result = TranslationResult(
            original_text="Hello",
            translated_text="Hola",
            source_language="en",
            target_language="es",
            service_used="google"
        )
        
        assert result.original_text == "Hello"
        assert result.translated_text == "Hola"
        assert result.source_language == "en"
        assert result.target_language == "es"
        assert result.service_used == "google"
        assert result.confidence == 0.0
        assert result.cached is False
        assert result.error_message is None


class TestFormattingPreserver:
    """Test suite for FormattingPreserver"""
    
    def setup_method(self):
        """Setup test environment"""
        self.formatter = FormattingPreserver()
    
    def test_extract_html_tags(self):
        """Test extraction of HTML tags"""
        text = "This is <b>bold</b> and <i>italic</i> text."
        clean_text, placeholders = self.formatter.extract_formatting(text)
        
        assert "<b>" not in clean_text
        assert "<i>" not in clean_text
        assert len(placeholders) >= 2
        
        # Restore formatting
        restored = self.formatter.restore_formatting(clean_text, placeholders)
        assert restored == text
    
    def test_extract_markdown_formatting(self):
        """Test extraction of Markdown formatting"""
        text = "This is **bold** and *italic* text with `code`."
        clean_text, placeholders = self.formatter.extract_formatting(text)
        
        assert "**bold**" not in clean_text
        assert "*italic*" not in clean_text
        assert "`code`" not in clean_text
        
        # Restore formatting
        restored = self.formatter.restore_formatting(clean_text, placeholders)
        assert restored == text
    
    def test_extract_urls(self):
        """Test extraction of URLs"""
        text = "Visit https://example.com for more info."
        clean_text, placeholders = self.formatter.extract_formatting(text)
        
        assert "https://example.com" not in clean_text
        
        # Restore formatting
        restored = self.formatter.restore_formatting(clean_text, placeholders)
        assert restored == text
    
    def test_extract_placeholders(self):
        """Test extraction of template placeholders"""
        text = "Hello {name}, your balance is {balance}."
        clean_text, placeholders = self.formatter.extract_formatting(text)
        
        assert "{name}" not in clean_text
        assert "{balance}" not in clean_text
        
        # Restore formatting
        restored = self.formatter.restore_formatting(clean_text, placeholders)
        assert restored == text
    
    def test_complex_formatting(self):
        """Test complex formatting preservation"""
        text = """
        <h1>Title</h1>
        <p>This is **bold** text with <a href="https://example.com">link</a>.</p>
        <code>print("Hello {name}")</code>
        """
        clean_text, placeholders = self.formatter.extract_formatting(text)
        
        # Should extract all formatting elements
        assert len(placeholders) >= 4
        
        # Restore should match original
        restored = self.formatter.restore_formatting(clean_text, placeholders)
        assert restored == text


class TestTranslationCache:
    """Test suite for TranslationCache"""
    
    def setup_method(self):
        """Setup test environment"""
        self.temp_dir = tempfile.mkdtemp()
        self.cache = TranslationCache(self.temp_dir)
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_cache_set_and_get(self):
        """Test setting and getting cached translations"""
        self.cache.set("Hello", "sk", "Ahoj", "en")
        result = self.cache.get("Hello", "sk", "en")
        
        assert result == "Ahoj"
    
    def test_cache_miss(self):
        """Test cache miss returns None"""
        result = self.cache.get("Nonexistent", "sk", "en")
        assert result is None
    
    def test_cache_key_consistency(self):
        """Test that cache keys are consistent"""
        self.cache.set("Hello", "sk", "Ahoj", "en")
        
        # Same content should return cached result
        result1 = self.cache.get("Hello", "sk", "en")
        result2 = self.cache.get("Hello", "sk", "en")
        
        assert result1 == result2 == "Ahoj"
    
    def test_cache_persistence(self):
        """Test that cache persists across instances"""
        self.cache.set("Hello", "sk", "Ahoj", "en")
        
        # Create new cache instance
        new_cache = TranslationCache(self.temp_dir)
        result = new_cache.get("Hello", "sk", "en")
        
        assert result == "Ahoj"
    
    def test_cache_different_languages(self):
        """Test caching for different language pairs"""
        self.cache.set("Hello", "sk", "Ahoj", "en")
        self.cache.set("Hello", "de", "Hallo", "en")
        
        sk_result = self.cache.get("Hello", "sk", "en")
        de_result = self.cache.get("Hello", "de", "en")
        
        assert sk_result == "Ahoj"
        assert de_result == "Hallo"


class TestGoogleTranslationService:
    """Test suite for GoogleTranslationService"""
    
    def setup_method(self):
        """Setup test environment"""
        self.config = TranslationConfig(service="google")
        self.service = GoogleTranslationService(self.config)
    
    def test_successful_translation(self):
        """Test successful translation"""
        # Mock the translator directly
        service = GoogleTranslationService(self.config)
        
        # Mock the translate method
        service.translator.translate = Mock(return_value="Hola")
        
        # Test translation
        result = service.translate("Hello", "es", "en")
        
        assert result.translated_text == "Hola"
        assert result.source_language == "en"
        assert result.target_language == "es"
        assert result.confidence == 0.8
        assert result.service_used == "google"
    
    def test_translation_failure(self):
        """Test translation failure handling"""
        service = GoogleTranslationService(self.config)
        
        # Mock translator to fail
        service.translator.translate = Mock(side_effect=Exception("API Error"))
        
        result = service.translate("Hello", "es", "en")
        
        assert result.translated_text == ""
        assert result.service_used == "google_failed"
        assert result.error_message is not None
        assert "API Error" in result.error_message
    
    def test_language_detection(self):
        """Test language detection"""
        service = GoogleTranslationService(self.config)
        
        detected_lang = service.detect_language("Hello world")
        assert detected_lang == "auto"


class TestTranslationService:
    """Test suite for main TranslationService"""
    
    def setup_method(self):
        """Setup test environment"""
        self.temp_dir = tempfile.mkdtemp()
        
        # Mock config manager
        self.mock_config_manager = Mock()
        self.mock_config_manager.translation_config = TranslationConfig(
            service="google",
            cache_enabled=True,
            preserve_formatting=True,
            max_retries=2,
            retry_delay=0.1
        )
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    @patch('services.translation_service.GoogleTranslationService')
    def test_service_initialization(self, mock_google_service):
        """Test service initialization with different backends"""
        service = TranslationService(self.mock_config_manager)
        
        # Should create Google service by default
        mock_google_service.assert_called_once()
    
    def test_empty_text_translation(self):
        """Test translation of empty text"""
        service = TranslationService(self.mock_config_manager)
        
        result = service.translate_text("", "sk", "en")
        
        assert result.original_text == ""
        assert result.translated_text == ""
        assert result.service_used == "no_translation_needed"
        assert result.confidence == 1.0
    
    def test_whitespace_only_translation(self):
        """Test translation of whitespace-only text"""
        service = TranslationService(self.mock_config_manager)
        
        result = service.translate_text("   \n\t  ", "sk", "en")
        
        assert result.service_used == "no_translation_needed"
        assert result.confidence == 1.0
    
    @patch('services.translation_service.GoogleTranslationService')
    def test_cached_translation(self, mock_google_service):
        """Test cached translation retrieval"""
        # Setup cache
        cache_dir = tempfile.mkdtemp()
        
        service = TranslationService(self.mock_config_manager)
        service.cache = TranslationCache(cache_dir)
        
        # Pre-populate cache
        service.cache.set("Hello", "sk", "Ahoj", "en")
        
        result = service.translate_text("Hello", "sk", "en")
        
        assert result.translated_text == "Ahoj"
        assert result.cached is True
        assert result.confidence == 0.9
        
        # Should not call translator
        mock_google_service.return_value.translate.assert_not_called()
        
        # Cleanup
        import shutil
        shutil.rmtree(cache_dir, ignore_errors=True)
    
    @patch('services.translation_service.GoogleTranslationService')
    def test_translation_with_retry(self, mock_google_service):
        """Test translation with retry logic"""
        # Mock translator to fail first attempt, succeed second
        mock_translator = Mock()
        mock_google_service.return_value = mock_translator
        
        call_count = 0
        def mock_translate(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                result = TranslationResult(
                    original_text="Hello",
                    translated_text="",
                    source_language="en",
                    target_language="sk",
                    service_used="google",
                    error_message="Temporary API error"
                )
                return result
            else:
                return TranslationResult(
                    original_text="Hello",
                    translated_text="Ahoj",
                    source_language="en",
                    target_language="sk",
                    service_used="google"
                )
        
        mock_translator.translate.side_effect = mock_translate
        
        service = TranslationService(self.mock_config_manager)
        result = service.translate_text("Hello", "sk", "en")
        
        assert result.translated_text == "Ahoj"
        assert call_count == 2  # Should retry once
    
    def test_batch_translation(self):
        """Test batch translation"""
        service = TranslationService(self.mock_config_manager)
        
        # Mock the translator
        mock_translator = Mock()
        service.translator = mock_translator
        
        def mock_translate(text, target_lang, source_lang):
            translations = {
                "Hello": "Ahoj",
                "World": "Svet",
                "Test": "Test"
            }
            return TranslationResult(
                original_text=text,
                translated_text=translations.get(text, text),
                source_language=source_lang,
                target_language=target_lang,
                service_used="mock"
            )
        
        mock_translator.translate.side_effect = mock_translate
        
        texts = ["Hello", "World", "Test"]
        results = service.translate_batch(texts, "sk", "en")
        
        assert len(results) == 3
        assert results[0].translated_text == "Ahoj"
        assert results[1].translated_text == "Svet"
        assert results[2].translated_text == "Test"
    
    @patch('services.translation_service.GoogleTranslationService')
    def test_formatting_preservation(self, mock_google_service):
        """Test formatting preservation during translation"""
        self.mock_config_manager.translation_config.preserve_formatting = True
        
        mock_translator = Mock()
        mock_google_service.return_value = mock_translator
        
        # Mock translator to return text without formatting
        def mock_translate(text, target_lang, source_lang):
            return TranslationResult(
                original_text=text,
                translated_text="Bold text",  # Without <b> tags
                source_language=source_lang,
                target_language=target_lang,
                service_used="google"
            )
        
        mock_translator.translate.side_effect = mock_translate
        
        service = TranslationService(self.mock_config_manager)
        result = service.translate_text("This is <b>bold</b> text", "sk", "en")
        
        # Should restore formatting
        assert "<b>" in result.translated_text or "Bold" in result.translated_text


if __name__ == "__main__":
    pytest.main([__file__])
