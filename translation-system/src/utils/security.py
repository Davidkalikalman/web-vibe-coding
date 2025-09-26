"""
Security utilities for Multilingual Text Management System

Provides encryption, credential management, and security validation
for protecting sensitive data and communications.
"""

import os
import base64
import logging
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet
import hashlib
import secrets


class CredentialManager:
    """Secure credential management with encryption"""

    def __init__(self, key_file: Optional[str] = None):
        """
        Initialize credential manager

        Args:
            key_file: Path to encryption key file (optional)
        """
        self.logger = logging.getLogger(__name__)
        self.key_file = key_file or os.path.join(os.path.expanduser("~"), ".translation_key")
        self._cipher = None
        self._initialize_encryption()

    def _initialize_encryption(self) -> None:
        """Initialize encryption cipher"""
        try:
            # Try to load existing key
            if os.path.exists(self.key_file):
                with open(self.key_file, "rb") as f:
                    key = f.read()
            else:
                # Generate new key
                key = Fernet.generate_key()

                # Save key securely
                os.makedirs(os.path.dirname(self.key_file), exist_ok=True)
                with open(self.key_file, "wb") as f:
                    f.write(key)

                # Set secure permissions
                os.chmod(self.key_file, 0o600)
                self.logger.info(f"Generated new encryption key: {self.key_file}")

            self._cipher = Fernet(key)

        except Exception as e:
            self.logger.error(f"Failed to initialize encryption: {e}")
            # Fallback to base64 encoding (less secure)
            self._cipher = None

    def encrypt_credential(self, credential: str) -> str:
        """
        Encrypt credential

        Args:
            credential: Credential to encrypt

        Returns:
            str: Encrypted credential (base64 encoded)
        """
        if not credential:
            return ""

        try:
            if self._cipher:
                encrypted = self._cipher.encrypt(credential.encode())
                return base64.b64encode(encrypted).decode()
            else:
                # Fallback to base64 (not secure, but better than plaintext)
                self.logger.warning("Using fallback base64 encoding (not secure)")
                return base64.b64encode(credential.encode()).decode()

        except Exception as e:
            self.logger.error(f"Failed to encrypt credential: {e}")
            return credential  # Return as-is if encryption fails

    def decrypt_credential(self, encrypted_credential: str) -> str:
        """
        Decrypt credential

        Args:
            encrypted_credential: Encrypted credential (base64 encoded)

        Returns:
            str: Decrypted credential
        """
        if not encrypted_credential:
            return ""

        try:
            encrypted_bytes = base64.b64decode(encrypted_credential.encode())

            if self._cipher:
                decrypted = self._cipher.decrypt(encrypted_bytes)
                return decrypted.decode()
            else:
                # Fallback base64 decoding
                return encrypted_bytes.decode()

        except Exception as e:
            self.logger.error(f"Failed to decrypt credential: {e}")
            return encrypted_credential  # Return as-is if decryption fails

    def store_credentials(
        self, credentials: Dict[str, str], storage_file: Optional[str] = None
    ) -> bool:
        """
        Store encrypted credentials to file

        Args:
            credentials: Dictionary of credentials to store
            storage_file: Path to storage file

        Returns:
            bool: True if successful
        """
        if not storage_file:
            storage_file = os.path.join(os.path.expanduser("~"), ".translation_credentials")

        try:
            encrypted_creds = {}
            for key, value in credentials.items():
                encrypted_creds[key] = self.encrypt_credential(value)

            # Store as JSON
            import json

            with open(storage_file, "w") as f:
                json.dump(encrypted_creds, f, indent=2)

            # Set secure permissions
            os.chmod(storage_file, 0o600)

            self.logger.info(f"Stored {len(credentials)} credentials securely")
            return True

        except Exception as e:
            self.logger.error(f"Failed to store credentials: {e}")
            return False

    def load_credentials(self, storage_file: Optional[str] = None) -> Dict[str, str]:
        """
        Load and decrypt credentials from file

        Args:
            storage_file: Path to storage file

        Returns:
            Dict[str, str]: Decrypted credentials
        """
        if not storage_file:
            storage_file = os.path.join(os.path.expanduser("~"), ".translation_credentials")

        if not os.path.exists(storage_file):
            return {}

        try:
            import json

            with open(storage_file, "r") as f:
                encrypted_creds = json.load(f)

            credentials = {}
            for key, encrypted_value in encrypted_creds.items():
                credentials[key] = self.decrypt_credential(encrypted_value)

            self.logger.info(f"Loaded {len(credentials)} credentials")
            return credentials

        except Exception as e:
            self.logger.error(f"Failed to load credentials: {e}")
            return {}


class SecurityValidator:
    """Security validation for system components"""

    def __init__(self):
        """Initialize security validator"""
        self.logger = logging.getLogger(__name__)

    def validate_ftp_connection(self, host: str, port: int, use_tls: bool = True) -> Dict[str, Any]:
        """
        Validate FTP connection security

        Args:
            host: FTP host
            port: FTP port
            use_tls: Whether TLS is enabled

        Returns:
            Dict: Validation results
        """
        results = {"secure": True, "warnings": [], "errors": [], "recommendations": []}

        # Check TLS usage
        if not use_tls:
            results["secure"] = False
            results["errors"].append("TLS/SSL not enabled for FTP connection")
            results["recommendations"].append("Enable FTP_USE_TLS=true for secure connections")

        # Check default ports
        if port == 21 and use_tls:
            results["warnings"].append(
                "Using default FTP port 21 with TLS (consider FTPS port 990)"
            )
            results["recommendations"].append(
                "Consider using dedicated FTPS port (990) or SFTP (22)"
            )

        if port == 21 and not use_tls:
            results["secure"] = False
            results["errors"].append("Using insecure FTP on default port 21")

        # Check host security
        if host in ["localhost", "127.0.0.1"]:
            results["warnings"].append("Using localhost FTP connection")

        return results

    def validate_api_key(self, api_key: str, service: str) -> Dict[str, Any]:
        """
        Validate API key security

        Args:
            api_key: API key to validate
            service: Service name

        Returns:
            Dict: Validation results
        """
        results = {"secure": True, "warnings": [], "errors": [], "recommendations": []}

        if not api_key:
            results["secure"] = False
            results["errors"].append(f"No API key provided for {service}")
            return results

        # Check API key length
        if len(api_key) < 16:
            results["warnings"].append(
                f"API key for {service} seems short (less than 16 characters)"
            )

        # Check for common insecure patterns
        if api_key.lower() in ["test", "demo", "example", "placeholder"]:
            results["secure"] = False
            results["errors"].append(f"API key for {service} appears to be a placeholder")

        # Check for leaked credentials patterns
        if api_key.startswith("sk-") and service == "openai":
            if len(api_key) < 48:
                results["warnings"].append("OpenAI API key appears incomplete")

        return results

    def validate_file_permissions(self, file_path: str) -> Dict[str, Any]:
        """
        Validate file permissions for security

        Args:
            file_path: Path to file

        Returns:
            Dict: Validation results
        """
        results = {"secure": True, "warnings": [], "errors": [], "recommendations": []}

        if not os.path.exists(file_path):
            results["errors"].append(f"File does not exist: {file_path}")
            return results

        try:
            # Check file permissions
            stat_info = os.stat(file_path)
            permissions = oct(stat_info.st_mode)[-3:]

            # Check if file is world-readable
            if int(permissions[2]) & 4:
                results["secure"] = False
                results["errors"].append(f"File {file_path} is world-readable")
                results["recommendations"].append(f"Set secure permissions: chmod 600 {file_path}")

            # Check if file is group-readable for sensitive files
            if file_path.endswith((".env", ".key", ".credentials")) and int(permissions[1]) & 4:
                results["warnings"].append(f"Sensitive file {file_path} is group-readable")
                results["recommendations"].append(
                    f"Consider more restrictive permissions: chmod 600 {file_path}"
                )

        except Exception as e:
            results["errors"].append(f"Could not check permissions for {file_path}: {e}")

        return results

    def validate_environment_security(self) -> Dict[str, Any]:
        """
        Validate environment security settings

        Returns:
            Dict: Validation results
        """
        results = {"secure": True, "warnings": [], "errors": [], "recommendations": []}

        # Check for sensitive environment variables
        sensitive_vars = ["FTP_PASSWORD", "TRANSLATION_API_KEY", "OPENAI_API_KEY", "DEEPL_API_KEY"]

        for var in sensitive_vars:
            value = os.getenv(var)
            if value:
                # Check if value looks like a placeholder
                if value.lower() in ["your-password", "your-api-key", "placeholder", "changeme"]:
                    results["secure"] = False
                    results["errors"].append(
                        f"Environment variable {var} contains placeholder value"
                    )

                # Warn about short passwords
                if "PASSWORD" in var and len(value) < 8:
                    results["warnings"].append(f"Password in {var} is shorter than 8 characters")

        # Check for .env file security
        env_file = ".env"
        if os.path.exists(env_file):
            env_validation = self.validate_file_permissions(env_file)
            if not env_validation["secure"]:
                results["secure"] = False
                results["errors"].extend(env_validation["errors"])
            results["warnings"].extend(env_validation["warnings"])
            results["recommendations"].extend(env_validation["recommendations"])

        return results


class SecureConfigManager:
    """Secure configuration management with encryption"""

    def __init__(self, credential_manager: Optional[CredentialManager] = None):
        """
        Initialize secure config manager

        Args:
            credential_manager: Credential manager instance
        """
        self.credential_manager = credential_manager or CredentialManager()
        self.validator = SecurityValidator()
        self.logger = logging.getLogger(__name__)

    def validate_security_settings(self, config_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate security settings in configuration

        Args:
            config_dict: Configuration dictionary

        Returns:
            Dict: Validation results
        """
        results = {"secure": True, "warnings": [], "errors": [], "recommendations": []}

        # Validate FTP settings
        ftp_config = config_dict.get("ftp", {})
        if ftp_config:
            ftp_validation = self.validator.validate_ftp_connection(
                ftp_config.get("host", ""),
                ftp_config.get("port", 21),
                ftp_config.get("use_tls", True),
            )

            if not ftp_validation["secure"]:
                results["secure"] = False

            results["warnings"].extend(ftp_validation["warnings"])
            results["errors"].extend(ftp_validation["errors"])
            results["recommendations"].extend(ftp_validation["recommendations"])

        # Validate translation service settings
        translation_config = config_dict.get("translation", {})
        service = translation_config.get("service", "google")

        # Check API key if required
        api_key_var = {
            "openai": "OPENAI_API_KEY",
            "deepl": "DEEPL_API_KEY",
            "azure": "AZURE_TRANSLATOR_KEY",
        }.get(service)

        if api_key_var:
            api_key = os.getenv(api_key_var)
            api_validation = self.validator.validate_api_key(api_key or "", service)

            if not api_validation["secure"]:
                results["secure"] = False

            results["warnings"].extend(api_validation["warnings"])
            results["errors"].extend(api_validation["errors"])
            results["recommendations"].extend(api_validation["recommendations"])

        # Validate environment security
        env_validation = self.validator.validate_environment_security()
        if not env_validation["secure"]:
            results["secure"] = False

        results["warnings"].extend(env_validation["warnings"])
        results["errors"].extend(env_validation["errors"])
        results["recommendations"].extend(env_validation["recommendations"])

        return results

    def generate_secure_credentials(self) -> Dict[str, str]:
        """
        Generate secure credentials for testing/development

        Returns:
            Dict: Generated credentials
        """
        credentials = {
            "ftp_password": self._generate_password(16),
            "api_key": self._generate_api_key(32),
            "encryption_key": secrets.token_urlsafe(32),
        }

        self.logger.info("Generated secure credentials for development")
        return credentials

    def _generate_password(self, length: int = 16) -> str:
        """Generate secure password"""
        import string

        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        return "".join(secrets.choice(alphabet) for _ in range(length))

    def _generate_api_key(self, length: int = 32) -> str:
        """Generate secure API key"""
        return secrets.token_urlsafe(length)


def hash_file(file_path: str) -> str:
    """
    Generate SHA-256 hash of file content

    Args:
        file_path: Path to file

    Returns:
        str: Hexadecimal hash
    """
    sha256_hash = hashlib.sha256()

    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    except Exception:
        return ""


def secure_delete_file(file_path: str) -> bool:
    """
    Securely delete file by overwriting with random data

    Args:
        file_path: Path to file

    Returns:
        bool: True if successful
    """
    try:
        if not os.path.exists(file_path):
            return True

        # Get file size
        file_size = os.path.getsize(file_path)

        # Overwrite with random data multiple times
        for _ in range(3):
            with open(file_path, "wb") as f:
                f.write(os.urandom(file_size))
                f.flush()
                os.fsync(f.fileno())

        # Finally delete the file
        os.remove(file_path)
        return True

    except Exception:
        return False


def validate_input_security(input_text: str, max_length: int = 10000) -> Dict[str, Any]:
    """
    Validate input for security issues

    Args:
        input_text: Text to validate
        max_length: Maximum allowed length

    Returns:
        Dict: Validation results
    """
    results = {"safe": True, "warnings": [], "errors": []}

    # Check length
    if len(input_text) > max_length:
        results["safe"] = False
        results["errors"].append(f"Input too long: {len(input_text)} > {max_length}")

    # Check for potential script injection
    dangerous_patterns = ["<script", "javascript:", "data:", "vbscript:", "onload=", "onerror="]

    for pattern in dangerous_patterns:
        if pattern.lower() in input_text.lower():
            results["safe"] = False
            results["errors"].append(f"Potentially dangerous pattern detected: {pattern}")

    # Check for null bytes
    if "\x00" in input_text:
        results["safe"] = False
        results["errors"].append("Null byte detected in input")

    return results


# Utility function to create secure temp files
def create_secure_temp_file(prefix: str = "translation_", suffix: str = ".tmp") -> str:
    """
    Create secure temporary file

    Args:
        prefix: File prefix
        suffix: File suffix

    Returns:
        str: Path to temporary file
    """
    import tempfile

    # Create temp file with secure permissions
    fd, temp_path = tempfile.mkstemp(prefix=prefix, suffix=suffix)

    try:
        # Set secure permissions (owner read/write only)
        os.fchmod(fd, 0o600)
        os.close(fd)
        return temp_path
    except Exception:
        # Clean up on error
        try:
            os.close(fd)
            os.unlink(temp_path)
        except Exception:
            pass
        raise
