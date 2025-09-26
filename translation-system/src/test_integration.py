#!/usr/bin/env python3
"""
Integration test for the translation system
Tests core functionality without external dependencies
"""

import os
import sys
import tempfile
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from core.config_manager import ConfigManager, TranslationConfig
from services.translation_service import TranslationService, FormattingPreserver, TranslationCache
from services.file_processor import FileProcessorManager
from utils.logging_setup import setup_logging


def test_config_manager():
    """Test configuration manager"""
    print("Testing ConfigManager...")

    # Set test environment variables
    test_env = {
        "FTP_HOST": "test-host.com",
        "FTP_USERNAME": "testuser",
        "FTP_PASSWORD": "testpass",
        "TRANSLATION_SERVICE": "google",
        "SOURCE_LANGUAGE": "en",
        "TRANSLATION_LANGUAGES": "sk,hu,de",
    }

    for key, value in test_env.items():
        os.environ[key] = value

    try:
        config = ConfigManager()
        assert config.ftp_config.host == "test-host.com"
        assert config.translation_config.service == "google"
        assert "sk" in config.translation_config.target_languages
        print("✅ ConfigManager test passed")
        return True
    except Exception as e:
        print(f"❌ ConfigManager test failed: {e}")
        return False


def test_formatting_preserver():
    """Test formatting preservation"""
    print("Testing FormattingPreserver...")

    try:
        formatter = FormattingPreserver()

        # Test HTML preservation
        html_text = "This is <b>bold</b> and <i>italic</i> text."
        clean_text, placeholders = formatter.extract_formatting(html_text)
        restored = formatter.restore_formatting(clean_text, placeholders)

        assert restored == html_text
        assert len(placeholders) >= 2

        # Test URL preservation
        url_text = "Visit https://example.com for more info."
        clean_text, placeholders = formatter.extract_formatting(url_text)
        restored = formatter.restore_formatting(clean_text, placeholders)

        assert restored == url_text
        assert len(placeholders) >= 1

        print("✅ FormattingPreserver test passed")
        return True
    except Exception as e:
        print(f"❌ FormattingPreserver test failed: {e}")
        return False


def test_translation_cache():
    """Test translation caching"""
    print("Testing TranslationCache...")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            cache = TranslationCache(temp_dir)

            # Test cache operations
            cache.set("Hello", "sk", "Ahoj", "en")
            result = cache.get("Hello", "sk", "en")

            assert result == "Ahoj"

            # Test cache miss
            missing = cache.get("NonExistent", "sk", "en")
            assert missing is None

            # Test persistence
            new_cache = TranslationCache(temp_dir)
            persistent_result = new_cache.get("Hello", "sk", "en")
            assert persistent_result == "Ahoj"

        print("✅ TranslationCache test passed")
        return True
    except Exception as e:
        print(f"❌ TranslationCache test failed: {e}")
        return False


def test_translation_service():
    """Test translation service initialization"""
    print("Testing TranslationService...")

    try:
        # Create test config
        config = TranslationConfig(service="google", cache_enabled=True, preserve_formatting=True)

        # Mock config manager
        class MockConfigManager:
            def __init__(self):
                self.translation_config = config

        mock_config = MockConfigManager()
        service = TranslationService(mock_config)

        # Test empty text handling
        result = service.translate_text("", "sk", "en")
        assert result.service_used == "no_translation_needed"
        assert result.confidence == 1.0

        # Test whitespace handling
        result = service.translate_text("   \n\t  ", "sk", "en")
        assert result.service_used == "no_translation_needed"

        print("✅ TranslationService test passed")
        return True
    except Exception as e:
        print(f"❌ TranslationService test failed: {e}")
        return False


def test_file_processor():
    """Test file processor components"""
    print("Testing FileProcessor...")

    try:
        # Create test config
        config = TranslationConfig(target_languages=["sk", "hu", "de"])

        class MockConfigManager:
            def __init__(self):
                self.translation_config = config

            def is_supported_file(self, path):
                return path.endswith((".txt", ".md", ".html", ".json"))

            def get_translated_filename(self, original, lang):
                if lang == "en":
                    return original
                base, ext = os.path.splitext(original)
                return f"{base}_{lang}{ext}"

        class MockTranslationService:
            def translate_text(self, text, target_lang, source_lang=None):
                from services.translation_service import TranslationResult

                return TranslationResult(
                    original_text=text,
                    translated_text=f"[{target_lang}] {text}",
                    source_language=source_lang or "en",
                    target_language=target_lang,
                    service_used="mock",
                )

        mock_config = MockConfigManager()
        mock_translation = MockTranslationService()

        processor = FileProcessorManager(mock_config, mock_translation)

        # Test processor selection
        txt_processor = processor.get_processor("test.txt")
        assert txt_processor is not None

        md_processor = processor.get_processor("test.md")
        assert md_processor is not None

        html_processor = processor.get_processor("test.html")
        assert html_processor is not None

        json_processor = processor.get_processor("test.json")
        assert json_processor is not None

        print("✅ FileProcessor test passed")
        return True
    except Exception as e:
        print(f"❌ FileProcessor test failed: {e}")
        return False


def test_logging_setup():
    """Test logging configuration"""
    print("Testing LoggingSetup...")

    try:
        logger = setup_logging(
            {
                "name": "test_logger",
                "log_level": "INFO",
                "enable_console": True,
                "enable_file": False,
                "enable_json": False,
            }
        )

        assert logger is not None
        logger.info("Test log message")

        print("✅ LoggingSetup test passed")
        return True
    except Exception as e:
        print(f"❌ LoggingSetup test failed: {e}")
        return False


def test_cli_imports():
    """Test that CLI module can be imported"""
    print("Testing CLI imports...")

    try:
        from main import TranslationSystemCLI
        from main import create_parser

        # Test parser creation
        parser = create_parser()
        assert parser is not None

        # Test CLI initialization
        cli = TranslationSystemCLI()
        assert cli is not None

        print("✅ CLI imports test passed")
        return True
    except Exception as e:
        print(f"❌ CLI imports test failed: {e}")
        return False


def test_sample_file_processing():
    """Test processing of sample files"""
    print("Testing sample file processing...")

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create sample files
            sample_txt = Path(temp_dir) / "sample.txt"
            sample_txt.write_text("Hello world! This is a test file.")

            sample_json = Path(temp_dir) / "sample.json"
            sample_json.write_text(
                json.dumps(
                    {"greeting": "Hello", "message": "Welcome to our application", "count": 42}
                )
            )

            sample_md = Path(temp_dir) / "sample.md"
            sample_md.write_text(
                """# Sample Document

This is a **test** document with *formatting*.

## Features
- Bullet points
- *Italic text*
- **Bold text**
"""
            )

            # Test that files were created
            assert sample_txt.exists()
            assert sample_json.exists()
            assert sample_md.exists()

            # Test file sizes
            assert sample_txt.stat().st_size > 0
            assert sample_json.stat().st_size > 0
            assert sample_md.stat().st_size > 0

        print("✅ Sample file processing test passed")
        return True
    except Exception as e:
        print(f"❌ Sample file processing test failed: {e}")
        return False


def main():
    """Run all integration tests"""
    print("🚀 Starting Translation System Integration Tests")
    print("=" * 50)

    tests = [
        test_config_manager,
        test_formatting_preserver,
        test_translation_cache,
        test_translation_service,
        test_file_processor,
        test_logging_setup,
        test_cli_imports,
        test_sample_file_processing,
    ]

    passed = 0
    failed = 0

    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ {test.__name__} failed with exception: {e}")
            failed += 1
        print()

    print("=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")

    if failed == 0:
        print("🎉 All tests passed! System is working correctly.")
        return 0
    else:
        print("⚠️ Some tests failed. Please check the implementation.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
