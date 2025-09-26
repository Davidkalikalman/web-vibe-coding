"""
Unit tests for Configuration Manager

Tests configuration loading, validation, and management functionality.
"""

import os
import json
import tempfile
import pytest
from pathlib import Path
from unittest.mock import patch, mock_open

import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from core.config_manager import ConfigManager, FTPConfig, TranslationConfig, ProcessingConfig


class TestConfigManager:
    """Test suite for ConfigManager class"""
    
    def setup_method(self):
        """Setup test environment"""
        self.temp_dir = tempfile.mkdtemp()
        self.config_file = os.path.join(self.temp_dir, "test_config.json")
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_default_configuration(self):
        """Test loading default configuration"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass',
            'TRANSLATION_SERVICE': 'google',
            'SOURCE_LANGUAGE': 'en',
            'TRANSLATION_LANGUAGES': 'sk,hu,de'
        }):
            config = ConfigManager()
            
            assert config.ftp_config.host == 'test-host.com'
            assert config.ftp_config.username == 'testuser'
            assert config.translation_config.service == 'google'
            assert config.translation_config.source_language == 'en'
            assert 'sk' in config.translation_config.target_languages
    
    def test_config_file_loading(self):
        """Test loading configuration from file"""
        config_data = {
            "ftp": {
                "host": "file-host.com",
                "port": 22,
                "use_tls": False
            },
            "translation": {
                "service": "deepl",
                "target_languages": ["sk", "de"],
                "max_retries": 5
            }
        }
        
        with open(self.config_file, 'w') as f:
            json.dump(config_data, f)
        
        with patch.dict(os.environ, {
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }):
            config = ConfigManager(self.config_file)
            
            assert config.ftp_config.host == 'file-host.com'
            assert config.ftp_config.port == 22
            assert config.ftp_config.use_tls is False
            assert config.translation_config.service == 'deepl'
            assert config.translation_config.max_retries == 5
    
    def test_config_validation_success(self):
        """Test successful configuration validation"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'valid-host.com',
            'FTP_USERNAME': 'validuser',
            'FTP_PASSWORD': 'validpass',
            'TRANSLATION_LANGUAGES': 'sk,en,hu'
        }):
            # Should not raise exception
            config = ConfigManager()
            assert config.ftp_config.host == 'valid-host.com'
    
    def test_config_validation_missing_ftp_host(self):
        """Test validation failure for missing FTP host"""
        with patch.dict(os.environ, {
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }, clear=True):
            with pytest.raises(ValueError, match="FTP host is required"):
                ConfigManager()
    
    def test_config_validation_missing_credentials(self):
        """Test validation failure for missing credentials"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com'
        }, clear=True):
            with pytest.raises(ValueError, match="FTP username is required"):
                ConfigManager()
    
    def test_get_translated_filename(self):
        """Test translated filename generation"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass',
            'SOURCE_LANGUAGE': 'en'
        }):
            config = ConfigManager()
            
            # Source language should not have suffix
            assert config.get_translated_filename("test.txt", "en") == "test.txt"
            
            # Target languages should have suffix
            assert config.get_translated_filename("test.txt", "sk") == "test_sk.txt"
            assert config.get_translated_filename("docs/file.md", "hu") == "docs/file_hu.md"
    
    def test_is_supported_file(self):
        """Test file support checking"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass',
            'SUPPORTED_EXTENSIONS': '.txt,.md,.html'
        }):
            config = ConfigManager()
            
            assert config.is_supported_file("test.txt") is True
            assert config.is_supported_file("test.md") is True
            assert config.is_supported_file("test.html") is True
            assert config.is_supported_file("test.pdf") is False
            assert config.is_supported_file("test.docx") is False
    
    def test_save_config(self):
        """Test saving configuration to file"""
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }):
            config = ConfigManager()
            config.save_config(self.config_file)
            
            assert os.path.exists(self.config_file)
            
            # Load and verify saved config
            with open(self.config_file, 'r') as f:
                saved_data = json.load(f)
            
            assert saved_data["ftp"]["host"] == "test-host.com"
            assert "username" not in saved_data["ftp"]  # Sensitive data not saved
            assert "password" not in saved_data["ftp"]
    
    def test_environment_variable_precedence(self):
        """Test that environment variables take precedence over file config"""
        config_data = {
            "ftp": {
                "host": "file-host.com",
                "port": 2121
            }
        }
        
        with open(self.config_file, 'w') as f:
            json.dump(config_data, f)
        
        with patch.dict(os.environ, {
            'FTP_HOST': 'env-host.com',
            'FTP_PORT': '9999',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }):
            config = ConfigManager(self.config_file)
            
            # Environment should override file
            assert config.ftp_config.host == 'env-host.com'
            assert config.ftp_config.port == 9999
    
    def test_invalid_config_file(self):
        """Test handling of invalid configuration file"""
        with open(self.config_file, 'w') as f:
            f.write("invalid json content")
        
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }):
            # Should not raise exception, should use environment variables
            config = ConfigManager(self.config_file)
            assert config.ftp_config.host == 'test-host.com'
    
    def test_nonexistent_config_file(self):
        """Test handling of nonexistent configuration file"""
        nonexistent_file = os.path.join(self.temp_dir, "nonexistent.json")
        
        with patch.dict(os.environ, {
            'FTP_HOST': 'test-host.com',
            'FTP_USERNAME': 'testuser',
            'FTP_PASSWORD': 'testpass'
        }):
            # Should not raise exception
            config = ConfigManager(nonexistent_file)
            assert config.ftp_config.host == 'test-host.com'


class TestFTPConfig:
    """Test suite for FTPConfig dataclass"""
    
    def test_ftp_config_defaults(self):
        """Test FTP configuration defaults"""
        config = FTPConfig(host="test-host.com")
        
        assert config.host == "test-host.com"
        assert config.port == 21
        assert config.use_tls is True
        assert config.passive_mode is True
        assert config.timeout == 30
        assert config.remote_base_path == "/"


class TestTranslationConfig:
    """Test suite for TranslationConfig dataclass"""
    
    def test_translation_config_defaults(self):
        """Test translation configuration defaults"""
        config = TranslationConfig()
        
        assert config.service == "google"
        assert config.source_language == "en"
        assert config.max_retries == 3
        assert config.cache_enabled is True
        assert config.preserve_formatting is True
    
    def test_translation_config_custom(self):
        """Test custom translation configuration"""
        config = TranslationConfig(
            service="deepl",
            source_language="sk",
            target_languages=["en", "de"],
            max_retries=5,
            cache_enabled=False
        )
        
        assert config.service == "deepl"
        assert config.source_language == "sk"
        assert config.target_languages == ["en", "de"]
        assert config.max_retries == 5
        assert config.cache_enabled is False


class TestProcessingConfig:
    """Test suite for ProcessingConfig dataclass"""
    
    def test_processing_config_defaults(self):
        """Test processing configuration defaults"""
        config = ProcessingConfig()
        
        assert config.max_file_size == 10 * 1024 * 1024  # 10MB
        assert config.batch_size == 10
        assert config.parallel_workers == 4
        assert config.backup_original is True
        assert config.overwrite_existing is False
    
    def test_processing_config_custom(self):
        """Test custom processing configuration"""
        config = ProcessingConfig(
            supported_extensions=[".txt", ".md"],
            max_file_size=5 * 1024 * 1024,  # 5MB
            batch_size=20,
            parallel_workers=8
        )
        
        assert config.supported_extensions == [".txt", ".md"]
        assert config.max_file_size == 5 * 1024 * 1024
        assert config.batch_size == 20
        assert config.parallel_workers == 8


class TestConfigManagerIntegration:
    """Integration tests for ConfigManager"""
    
    def test_full_configuration_cycle(self):
        """Test complete configuration loading and saving cycle"""
        temp_dir = tempfile.mkdtemp()
        config_file = os.path.join(temp_dir, "integration_test.json")
        
        try:
            # Create initial configuration
            with patch.dict(os.environ, {
                'FTP_HOST': 'integration-host.com',
                'FTP_USERNAME': 'integrationuser',
                'FTP_PASSWORD': 'integrationpass',
                'TRANSLATION_SERVICE': 'google',
                'SOURCE_LANGUAGE': 'en',
                'TRANSLATION_LANGUAGES': 'sk,hu,de,pl',
                'PARALLEL_WORKERS': '6',
                'MAX_FILE_SIZE': '20971520'  # 20MB
            }):
                config = ConfigManager()
                
                # Verify loaded configuration
                assert config.ftp_config.host == 'integration-host.com'
                assert config.translation_config.service == 'google'
                assert config.processing_config.parallel_workers == 6
                assert config.processing_config.max_file_size == 20971520
                
                # Save configuration
                config.save_config(config_file)
                
                # Load saved configuration
                config2 = ConfigManager(config_file)
                
                # Verify consistency (note: sensitive data won't be in file)
                assert config2.ftp_config.host == 'integration-host.com'
                assert config2.translation_config.service == 'google'
                assert config2.processing_config.parallel_workers == 6
        
        finally:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    pytest.main([__file__])
