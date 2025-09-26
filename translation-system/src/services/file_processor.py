"""
File Processor for Multilingual Text Management System

Handles various file types (txt, md, html, json) with content extraction,
translation, and preservation of original structure and formatting.
"""

import json
import logging
import chardet
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
from dataclasses import dataclass
from abc import ABC, abstractmethod

# For HTML processing
from bs4 import BeautifulSoup

from core.config_manager import ConfigManager
from services.translation_service import TranslationService


@dataclass
class FileProcessingResult:
    """Result of file processing operation"""

    file_path: str
    success: bool
    translated_files: List[str] = None
    processing_time: float = 0.0
    translations_count: int = 0
    error_message: Optional[str] = None

    def __post_init__(self):
        if self.translated_files is None:
            self.translated_files = []


class BaseFileProcessor(ABC):
    """Abstract base class for file processors"""

    def __init__(self, config_manager: ConfigManager, translation_service: TranslationService):
        self.config_manager = config_manager
        self.translation_service = translation_service
        self.logger = logging.getLogger(__name__)

    @abstractmethod
    def can_process(self, file_path: str) -> bool:
        """Check if this processor can handle the file type"""
        pass

    @abstractmethod
    def extract_translatable_content(self, content: str) -> List[Tuple[str, str]]:
        """Extract translatable content from file as (identifier, text) pairs"""
        pass

    @abstractmethod
    def rebuild_content(
        self, original_content: str, translations: Dict[str, Dict[str, str]]
    ) -> Dict[str, str]:
        """Rebuild content with translations for each language"""
        pass

    def detect_encoding(self, file_path: str) -> str:
        """Detect file encoding"""
        try:
            with open(file_path, "rb") as f:
                raw_data = f.read()
                result = chardet.detect(raw_data)
                return result["encoding"] or "utf-8"
        except Exception as e:
            self.logger.warning(f"Could not detect encoding for {file_path}: {e}")
            return "utf-8"

    def read_file(self, file_path: str) -> str:
        """Read file with proper encoding detection"""
        encoding = self.detect_encoding(file_path)

        try:
            with open(file_path, "r", encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            # Fallback to utf-8 with error handling
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
                self.logger.warning(f"Used fallback encoding for {file_path}")
                return content

    def write_file(self, file_path: str, content: str) -> None:
        """Write file with UTF-8 encoding"""
        Path(file_path).parent.mkdir(parents=True, exist_ok=True)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)


class TextFileProcessor(BaseFileProcessor):
    """Processor for plain text files (.txt)"""

    def can_process(self, file_path: str) -> bool:
        return Path(file_path).suffix.lower() == ".txt"

    def extract_translatable_content(self, content: str) -> List[Tuple[str, str]]:
        """Extract paragraphs from text file"""
        paragraphs = []
        lines = content.split("\n")
        current_paragraph = []
        paragraph_id = 0

        for line in lines:
            line = line.strip()
            if line:
                current_paragraph.append(line)
            else:
                if current_paragraph:
                    paragraph_text = " ".join(current_paragraph)
                    paragraphs.append((f"paragraph_{paragraph_id}", paragraph_text))
                    current_paragraph = []
                    paragraph_id += 1

        # Add final paragraph if exists
        if current_paragraph:
            paragraph_text = " ".join(current_paragraph)
            paragraphs.append((f"paragraph_{paragraph_id}", paragraph_text))

        return paragraphs

    def rebuild_content(
        self, original_content: str, translations: Dict[str, Dict[str, str]]
    ) -> Dict[str, str]:
        """Rebuild text content with translations"""
        results = {}

        for language in self.config_manager.translation_config.target_languages:
            if language == self.config_manager.translation_config.source_language:
                results[language] = original_content
                continue

            lang_translations = translations.get(language, {})

            # Replace paragraphs with translations
            for identifier, translation in lang_translations.items():
                if identifier.startswith("paragraph_"):
                    # This is a simplified approach - more sophisticated matching needed
                    # for production use
                    pass

            # For text files, we rebuild by joining translated paragraphs
            if lang_translations:
                translated_paragraphs = []
                for i in range(len(lang_translations)):
                    key = f"paragraph_{i}"
                    if key in lang_translations:
                        translated_paragraphs.append(lang_translations[key])

                results[language] = "\n\n".join(translated_paragraphs)
            else:
                results[language] = original_content

        return results


class MarkdownFileProcessor(BaseFileProcessor):
    """Processor for Markdown files (.md)"""

    def can_process(self, file_path: str) -> bool:
        return Path(file_path).suffix.lower() in [".md", ".markdown"]

    def extract_translatable_content(self, content: str) -> List[Tuple[str, str]]:
        """Extract translatable content from Markdown"""
        translatable = []
        lines = content.split("\n")

        for i, line in enumerate(lines):
            line_content = line.strip()

            # Skip empty lines and code blocks
            if not line_content or line_content.startswith("```"):
                continue

            # Extract headers
            if line_content.startswith("#"):
                header_text = line_content.lstrip("#").strip()
                if header_text:
                    translatable.append((f"header_{i}", header_text))

            # Extract regular paragraphs (not code, not links-only)
            elif not line_content.startswith("    ") and not line_content.startswith("\t"):
                # Remove markdown formatting for translation
                clean_text = self._clean_markdown_formatting(line_content)
                if clean_text and len(clean_text.split()) > 2:  # Only substantial text
                    translatable.append((f"line_{i}", clean_text))

        return translatable

    def _clean_markdown_formatting(self, text: str) -> str:
        """Remove markdown formatting for translation, but preserve structure"""
        # Remove bold/italic markers for translation
        import re

        # Keep the text but remove formatting markers
        text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)  # Bold
        text = re.sub(r"\*(.*?)\*", r"\1", text)  # Italic
        text = re.sub(r"`(.*?)`", r"\1", text)  # Code
        text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)  # Links (keep text, remove URL)

        return text.strip()

    def rebuild_content(
        self, original_content: str, translations: Dict[str, Dict[str, str]]
    ) -> Dict[str, str]:
        """Rebuild markdown content with translations"""
        results = {}

        for language in self.config_manager.translation_config.target_languages:
            if language == self.config_manager.translation_config.source_language:
                results[language] = original_content
                continue

            lang_translations = translations.get(language, {})
            lines = original_content.split("\n")
            translated_lines = []

            for i, line in enumerate(lines):
                # Check if we have a translation for this line
                header_key = f"header_{i}"
                line_key = f"line_{i}"

                if header_key in lang_translations:
                    # Rebuild header with original formatting
                    header_level = len(line) - len(line.lstrip("#"))
                    header_prefix = "#" * header_level
                    translated_lines.append(f"{header_prefix} {lang_translations[header_key]}")

                elif line_key in lang_translations:
                    # Rebuild line preserving markdown formatting
                    translated_lines.append(
                        self._restore_markdown_formatting(line, lang_translations[line_key])
                    )
                else:
                    # Keep original line (code blocks, empty lines, etc.)
                    translated_lines.append(line)

            results[language] = "\n".join(translated_lines)

        return results

    def _restore_markdown_formatting(self, original_line: str, translated_text: str) -> str:
        """Restore markdown formatting to translated text"""
        # This is a simplified approach - in production, you'd want more sophisticated
        # pattern matching to preserve exact formatting
        return translated_text


class HTMLFileProcessor(BaseFileProcessor):
    """Processor for HTML files (.html, .htm)"""

    def can_process(self, file_path: str) -> bool:
        return Path(file_path).suffix.lower() in [".html", ".htm"]

    def extract_translatable_content(self, content: str) -> List[Tuple[str, str]]:
        """Extract translatable content from HTML"""
        soup = BeautifulSoup(content, "html.parser")
        translatable = []

        # Extract text from common translatable tags
        translatable_tags = [
            "title",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "a",
            "span",
            "div",
            "td",
            "th",
            "li",
            "label",
            "button",
        ]

        for tag_name in translatable_tags:
            elements = soup.find_all(tag_name)
            for i, element in enumerate(elements):
                if element.string and element.string.strip():
                    text = element.string.strip()
                    if len(text) > 1 and not text.isdigit():  # Skip very short text and numbers
                        element_id = f"{tag_name}_{i}"
                        translatable.append((element_id, text))

        # Extract alt attributes from images
        images = soup.find_all("img", alt=True)
        for i, img in enumerate(images):
            alt_text = img.get("alt", "").strip()
            if alt_text and len(alt_text) > 1:
                translatable.append((f"img_alt_{i}", alt_text))

        # Extract title attributes
        elements_with_title = soup.find_all(attrs={"title": True})
        for i, element in enumerate(elements_with_title):
            title_text = element.get("title", "").strip()
            if title_text and len(title_text) > 1:
                translatable.append((f"title_attr_{i}", title_text))

        return translatable

    def rebuild_content(
        self, original_content: str, translations: Dict[str, Dict[str, str]]
    ) -> Dict[str, str]:
        """Rebuild HTML content with translations"""
        results = {}

        for language in self.config_manager.translation_config.target_languages:
            if language == self.config_manager.translation_config.source_language:
                results[language] = original_content
                continue

            lang_translations = translations.get(language, {})
            soup = BeautifulSoup(original_content, "html.parser")

            # Replace translatable text
            translatable_tags = [
                "title",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "p",
                "a",
                "span",
                "div",
                "td",
                "th",
                "li",
                "label",
                "button",
            ]

            for tag_name in translatable_tags:
                elements = soup.find_all(tag_name)
                for i, element in enumerate(elements):
                    element_id = f"{tag_name}_{i}"
                    if element_id in lang_translations and element.string:
                        element.string.replace_with(lang_translations[element_id])

            # Replace alt attributes
            images = soup.find_all("img", alt=True)
            for i, img in enumerate(images):
                alt_id = f"img_alt_{i}"
                if alt_id in lang_translations:
                    img["alt"] = lang_translations[alt_id]

            # Replace title attributes
            elements_with_title = soup.find_all(attrs={"title": True})
            for i, element in enumerate(elements_with_title):
                title_id = f"title_attr_{i}"
                if title_id in lang_translations:
                    element["title"] = lang_translations[title_id]

            results[language] = str(soup)

        return results


class JSONFileProcessor(BaseFileProcessor):
    """Processor for JSON files (.json)"""

    def can_process(self, file_path: str) -> bool:
        return Path(file_path).suffix.lower() == ".json"

    def extract_translatable_content(self, content: str) -> List[Tuple[str, str]]:
        """Extract translatable strings from JSON"""
        try:
            data = json.loads(content)
            translatable = []
            self._extract_json_strings(data, translatable, "")
            return translatable
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON content: {e}")
            return []

    def _extract_json_strings(
        self, obj: Any, translatable: List[Tuple[str, str]], path: str
    ) -> None:
        """Recursively extract translatable strings from JSON object"""
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_path = f"{path}.{key}" if path else key
                self._extract_json_strings(value, translatable, new_path)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                new_path = f"{path}[{i}]"
                self._extract_json_strings(item, translatable, new_path)
        elif isinstance(obj, str) and len(obj.strip()) > 1:
            # Only translate non-empty strings that aren't keys or technical values
            if not self._is_technical_string(obj):
                translatable.append((path, obj))

    def _is_technical_string(self, text: str) -> bool:
        """Check if string is technical (URLs, codes, etc.) and shouldn't be translated"""
        technical_patterns = [
            text.startswith("http"),
            text.startswith("www."),
            text.startswith("#"),
            text.isdigit(),
            len(text) < 2,
            text.upper() == text and len(text) < 10,  # Likely constants
        ]
        return any(technical_patterns)

    def rebuild_content(
        self, original_content: str, translations: Dict[str, Dict[str, str]]
    ) -> Dict[str, str]:
        """Rebuild JSON content with translations"""
        results = {}

        try:
            json.loads(original_content)
        except json.JSONDecodeError:
            # Return original for all languages if invalid JSON
            for language in self.config_manager.translation_config.target_languages:
                results[language] = original_content
            return results

        for language in self.config_manager.translation_config.target_languages:
            if language == self.config_manager.translation_config.source_language:
                results[language] = original_content
                continue

            lang_translations = translations.get(language, {})
            translated_data = json.loads(original_content)  # Deep copy

            # Apply translations
            for path, translation in lang_translations.items():
                self._set_json_value(translated_data, path, translation)

            results[language] = json.dumps(translated_data, ensure_ascii=False, indent=2)

        return results

    def _set_json_value(self, obj: Any, path: str, value: str) -> None:
        """Set value in JSON object using dot notation path"""
        parts = path.split(".")
        current = obj

        try:
            for part in parts[:-1]:
                if "[" in part and "]" in part:
                    # Handle array access
                    key, index_str = part.split("[")
                    index = int(index_str.rstrip("]"))
                    if key:
                        current = current[key]
                    current = current[index]
                else:
                    current = current[part]

            # Set final value
            final_part = parts[-1]
            if "[" in final_part and "]" in final_part:
                key, index_str = final_part.split("[")
                index = int(index_str.rstrip("]"))
                if key:
                    current[key][index] = value
                else:
                    current[index] = value
            else:
                current[final_part] = value

        except (KeyError, IndexError, ValueError) as e:
            self.logger.warning(f"Could not set JSON value at path {path}: {e}")


class FileProcessorManager:
    """Manager for file processing with multiple processors"""

    def __init__(self, config_manager: ConfigManager, translation_service: TranslationService):
        """
        Initialize file processor manager

        Args:
            config_manager: Configuration manager instance
            translation_service: Translation service instance
        """
        self.config_manager = config_manager
        self.translation_service = translation_service
        self.logger = logging.getLogger(__name__)

        # Initialize processors
        self.processors = [
            TextFileProcessor(config_manager, translation_service),
            MarkdownFileProcessor(config_manager, translation_service),
            HTMLFileProcessor(config_manager, translation_service),
            JSONFileProcessor(config_manager, translation_service),
        ]

    def get_processor(self, file_path: str) -> Optional[BaseFileProcessor]:
        """Get appropriate processor for file"""
        for processor in self.processors:
            if processor.can_process(file_path):
                return processor
        return None

    def process_file(
        self, file_path: str, output_dir: Optional[str] = None
    ) -> FileProcessingResult:
        """
        Process file and generate translations

        Args:
            file_path: Path to input file
            output_dir: Output directory (default: same as input)

        Returns:
            FileProcessingResult: Processing result
        """
        import time

        start_time = time.time()

        file_path = Path(file_path)

        if not file_path.exists():
            return FileProcessingResult(
                file_path=str(file_path),
                success=False,
                error_message=f"File does not exist: {file_path}",
            )

        # Check if file is supported
        if not self.config_manager.is_supported_file(str(file_path)):
            return FileProcessingResult(
                file_path=str(file_path),
                success=False,
                error_message=f"File type not supported: {file_path.suffix}",
            )

        # Get appropriate processor
        processor = self.get_processor(str(file_path))
        if not processor:
            return FileProcessingResult(
                file_path=str(file_path),
                success=False,
                error_message=f"No processor available for: {file_path.suffix}",
            )

        try:
            # Read original content
            original_content = processor.read_file(str(file_path))

            # Extract translatable content
            translatable_content = processor.extract_translatable_content(original_content)

            if not translatable_content:
                self.logger.warning(f"No translatable content found in {file_path}")
                return FileProcessingResult(
                    file_path=str(file_path),
                    success=True,
                    translations_count=0,
                    processing_time=time.time() - start_time,
                )

            # Translate content
            translations = {}
            source_lang = self.config_manager.translation_config.source_language

            for target_lang in self.config_manager.translation_config.target_languages:
                if target_lang == source_lang:
                    continue

                lang_translations = {}
                for identifier, text in translatable_content:
                    result = self.translation_service.translate_text(text, target_lang, source_lang)

                    if result.translated_text and not result.error_message:
                        lang_translations[identifier] = result.translated_text
                    else:
                        self.logger.warning(
                            f"Translation failed for {identifier}: {result.error_message}"
                        )
                        lang_translations[identifier] = text  # Keep original

                translations[target_lang] = lang_translations

            # Rebuild content for each language
            rebuilt_content = processor.rebuild_content(original_content, translations)

            # Save translated files
            output_dir = Path(output_dir) if output_dir else file_path.parent
            output_dir.mkdir(parents=True, exist_ok=True)

            translated_files = []
            for language, content in rebuilt_content.items():
                translated_filename = self.config_manager.get_translated_filename(
                    str(file_path.name), language
                )
                translated_path = output_dir / translated_filename

                processor.write_file(str(translated_path), content)
                translated_files.append(str(translated_path))

            processing_time = time.time() - start_time

            return FileProcessingResult(
                file_path=str(file_path),
                success=True,
                translated_files=translated_files,
                processing_time=processing_time,
                translations_count=len(translatable_content),
            )

        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"File processing failed: {e}"
            self.logger.error(error_msg)

            return FileProcessingResult(
                file_path=str(file_path),
                success=False,
                processing_time=processing_time,
                error_message=error_msg,
            )
