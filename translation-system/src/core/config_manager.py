"""
Configuration Manager for Multilingual Text Management System

Handles all configuration settings, environment variables, and security credentials
with proper validation and error handling.
"""

import os
import json
import logging
from typing import List, Optional
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv


@dataclass
class FTPConfig:
    """FTP connection configuration"""

    host: str
    port: int = 21
    username: str = ""
    password: str = ""
    use_tls: bool = True
    passive_mode: bool = True
    timeout: int = 30
    remote_base_path: str = "/"


@dataclass
class TranslationConfig:
    """Translation service configuration"""

    service: str = "google"  # google, deepl, azure, openai
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    source_language: str = "en"
    target_languages: List[str] = None
    max_retries: int = 3
    retry_delay: float = 1.0
    cache_enabled: bool = True
    preserve_formatting: bool = True


@dataclass
class ProcessingConfig:
    """File processing configuration"""

    supported_extensions: List[str] = None
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    batch_size: int = 10
    parallel_workers: int = 4
    backup_original: bool = True
    overwrite_existing: bool = False


class ConfigManager:
    """Central configuration management for the translation system"""

    DEFAULT_LANGUAGES = ["sk", "en", "hu", "de", "pl"]
    DEFAULT_EXTENSIONS = [".txt", ".md", ".html", ".json", ".xml"]

    def __init__(self, config_file: Optional[str] = None):
        """
        Initialize configuration manager

        Args:
            config_file: Path to configuration file (optional)
        """
        self.config_file = config_file
        self.config_dir = Path(__file__).parent.parent.parent / "config"
        self.config_dir.mkdir(exist_ok=True)

        # Load environment variables
        load_dotenv()

        # Initialize logger first
        self.logger = logging.getLogger(__name__)

        # Initialize configurations
        self.ftp_config = self._load_ftp_config()
        self.translation_config = self._load_translation_config()
        self.processing_config = self._load_processing_config()

        # Validate configurations
        self._validate_configs()

    def _load_ftp_config(self) -> FTPConfig:
        """Load FTP configuration from environment variables and config file"""
        # Start with defaults from config file
        file_config = {}
        if self.config_file and Path(self.config_file).exists():
            try:
                with open(self.config_file, "r") as f:
                    file_config = json.load(f).get("ftp", {})
            except Exception as e:
                self.logger.warning(f"Could not load FTP config from file: {e}")

        # Create config with file defaults, then override with environment variables
        config = FTPConfig(
            host=os.getenv("FTP_HOST", file_config.get("host", "")),
            port=int(os.getenv("FTP_PORT", str(file_config.get("port", 21)))),
            username=os.getenv("FTP_USERNAME", file_config.get("username", "")),
            password=os.getenv("FTP_PASSWORD", file_config.get("password", "")),
            use_tls=os.getenv("FTP_USE_TLS", str(file_config.get("use_tls", "true"))).lower()
            == "true",
            passive_mode=os.getenv(
                "FTP_PASSIVE", str(file_config.get("passive_mode", "true"))
            ).lower()
            == "true",
            timeout=int(os.getenv("FTP_TIMEOUT", str(file_config.get("timeout", 30)))),
            remote_base_path=os.getenv("FTP_BASE_PATH", file_config.get("remote_base_path", "/")),
        )

        return config

    def _load_translation_config(self) -> TranslationConfig:
        """Load translation configuration"""
        target_languages = os.getenv("TRANSLATION_LANGUAGES")
        if target_languages:
            target_languages = [lang.strip() for lang in target_languages.split(",")]
        else:
            target_languages = self.DEFAULT_LANGUAGES.copy()

        config = TranslationConfig(
            service=os.getenv("TRANSLATION_SERVICE", "google"),
            api_key=os.getenv("TRANSLATION_API_KEY"),
            api_endpoint=os.getenv("TRANSLATION_API_ENDPOINT"),
            source_language=os.getenv("SOURCE_LANGUAGE", "en"),
            target_languages=target_languages,
            max_retries=int(os.getenv("TRANSLATION_MAX_RETRIES", "3")),
            retry_delay=float(os.getenv("TRANSLATION_RETRY_DELAY", "1.0")),
            cache_enabled=os.getenv("TRANSLATION_CACHE", "true").lower() == "true",
            preserve_formatting=os.getenv("PRESERVE_FORMATTING", "true").lower() == "true",
        )

        # Override with config file if available
        if self.config_file and Path(self.config_file).exists():
            try:
                with open(self.config_file, "r") as f:
                    file_config = json.load(f).get("translation", {})
                    for key, value in file_config.items():
                        if hasattr(config, key):
                            setattr(config, key, value)
            except Exception as e:
                self.logger.warning(f"Could not load translation config from file: {e}")

        return config

    def _load_processing_config(self) -> ProcessingConfig:
        """Load file processing configuration"""
        extensions = os.getenv("SUPPORTED_EXTENSIONS")
        if extensions:
            extensions = [ext.strip() for ext in extensions.split(",")]
        else:
            extensions = self.DEFAULT_EXTENSIONS.copy()

        config = ProcessingConfig(
            supported_extensions=extensions,
            max_file_size=int(os.getenv("MAX_FILE_SIZE", str(10 * 1024 * 1024))),
            batch_size=int(os.getenv("BATCH_SIZE", "10")),
            parallel_workers=int(os.getenv("PARALLEL_WORKERS", "4")),
            backup_original=os.getenv("BACKUP_ORIGINAL", "true").lower() == "true",
            overwrite_existing=os.getenv("OVERWRITE_EXISTING", "false").lower() == "true",
        )

        # Override with config file if available
        if self.config_file and Path(self.config_file).exists():
            try:
                with open(self.config_file, "r") as f:
                    file_config = json.load(f).get("processing", {})
                    for key, value in file_config.items():
                        if hasattr(config, key):
                            setattr(config, key, value)
            except Exception as e:
                self.logger.warning(f"Could not load processing config from file: {e}")

        return config

    def _validate_configs(self) -> None:
        """Validate all configurations"""
        errors = []

        # Validate FTP config
        if not self.ftp_config.host:
            errors.append("FTP host is required")
        if not self.ftp_config.username:
            errors.append("FTP username is required")
        if not self.ftp_config.password:
            errors.append("FTP password is required")

        # Validate translation config
        if not self.translation_config.target_languages:
            errors.append("At least one target language is required")

        if (
            self.translation_config.service in ["openai", "azure"]
            and not self.translation_config.api_key
        ):
            errors.append(f"API key is required for {self.translation_config.service}")

        # Validate processing config
        if self.processing_config.max_file_size <= 0:
            errors.append("Max file size must be positive")

        if self.processing_config.parallel_workers <= 0:
            errors.append("Number of parallel workers must be positive")

        if errors:
            raise ValueError(f"Configuration validation failed: {'; '.join(errors)}")

    def save_config(self, config_file: Optional[str] = None) -> None:
        """Save current configuration to file"""
        if config_file:
            self.config_file = config_file

        if not self.config_file:
            self.config_file = str(self.config_dir / "config.json")

        config_data = {
            "ftp": {
                "host": self.ftp_config.host,
                "port": self.ftp_config.port,
                "use_tls": self.ftp_config.use_tls,
                "passive_mode": self.ftp_config.passive_mode,
                "timeout": self.ftp_config.timeout,
                "remote_base_path": self.ftp_config.remote_base_path,
            },
            "translation": {
                "service": self.translation_config.service,
                "source_language": self.translation_config.source_language,
                "target_languages": self.translation_config.target_languages,
                "max_retries": self.translation_config.max_retries,
                "retry_delay": self.translation_config.retry_delay,
                "cache_enabled": self.translation_config.cache_enabled,
                "preserve_formatting": self.translation_config.preserve_formatting,
            },
            "processing": {
                "supported_extensions": self.processing_config.supported_extensions,
                "max_file_size": self.processing_config.max_file_size,
                "batch_size": self.processing_config.batch_size,
                "parallel_workers": self.processing_config.parallel_workers,
                "backup_original": self.processing_config.backup_original,
                "overwrite_existing": self.processing_config.overwrite_existing,
            },
        }

        with open(self.config_file, "w") as f:
            json.dump(config_data, f, indent=2)

        self.logger.info(f"Configuration saved to {self.config_file}")

    def get_language_file_suffix(self, language: str) -> str:
        """Get file suffix for a given language"""
        if language == self.translation_config.source_language:
            return ""
        return f"_{language}"

    def is_supported_file(self, file_path: str) -> bool:
        """Check if file extension is supported"""
        return Path(file_path).suffix.lower() in self.processing_config.supported_extensions

    def get_translated_filename(self, original_file: str, target_language: str) -> str:
        """Generate translated filename with language suffix"""
        path = Path(original_file)
        suffix = self.get_language_file_suffix(target_language)

        if suffix:
            new_name = f"{path.stem}{suffix}{path.suffix}"
            return str(path.parent / new_name)

        return original_file


# Singleton instance
_config_manager: Optional[ConfigManager] = None


def get_config_manager(config_file: Optional[str] = None) -> ConfigManager:
    """Get singleton instance of configuration manager"""
    global _config_manager
    if _config_manager is None:
        _config_manager = ConfigManager(config_file)
    return _config_manager
