"""
Secure FTP Client for Multilingual Text Management System

Provides secure FTP operations with SSL/TLS support, retry logic,
and comprehensive error handling for file transfers.
"""

import ftplib
import ssl
import logging
import time
from typing import List, Optional, Dict, Any
from pathlib import Path
import paramiko
from dataclasses import dataclass

from core.config_manager import ConfigManager, FTPConfig


@dataclass
class TransferResult:
    """Result of file transfer operation"""

    success: bool
    local_path: str
    remote_path: str
    size_bytes: int = 0
    transfer_time: float = 0.0
    error_message: Optional[str] = None


class SecureFTPClient:
    """Secure FTP client with SSL/TLS support and error handling"""

    def __init__(self, config: FTPConfig):
        """
        Initialize secure FTP client

        Args:
            config: FTP configuration object
        """
        self.config = config
        self.ftp_client: Optional[ftplib.FTP] = None
        self.sftp_client: Optional[paramiko.SFTPClient] = None
        self.ssh_client: Optional[paramiko.SSHClient] = None
        self.logger = logging.getLogger(__name__)
        self.is_connected = False

    def connect(self) -> bool:
        """
        Establish secure connection to FTP server

        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            if self.config.use_tls:
                # Use FTPS (FTP over SSL/TLS)
                self.ftp_client = ftplib.FTP_TLS()
                self.ftp_client.set_debuglevel(0)

                # Create SSL context
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE

                self.ftp_client.connect(
                    self.config.host, self.config.port, timeout=self.config.timeout
                )
                self.ftp_client.login(self.config.username, self.config.password)

                # Secure data connection
                self.ftp_client.prot_p()

                if self.config.passive_mode:
                    self.ftp_client.set_pasv(True)

                self.logger.info(f"Secure FTPS connection established to {self.config.host}")

            else:
                # Use regular FTP
                self.ftp_client = ftplib.FTP()
                self.ftp_client.connect(
                    self.config.host, self.config.port, timeout=self.config.timeout
                )
                self.ftp_client.login(self.config.username, self.config.password)

                if self.config.passive_mode:
                    self.ftp_client.set_pasv(True)

                self.logger.info(f"FTP connection established to {self.config.host}")

            # Change to base directory
            if self.config.remote_base_path != "/":
                self.ftp_client.cwd(self.config.remote_base_path)

            self.is_connected = True
            return True

        except Exception as e:
            self.logger.error(f"Failed to connect to FTP server: {e}")
            self.is_connected = False
            return False

    def connect_sftp(self) -> bool:
        """
        Establish SFTP connection as alternative to FTP

        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            self.ssh_client = paramiko.SSHClient()
            self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

            self.ssh_client.connect(
                hostname=self.config.host,
                port=self.config.port if self.config.port != 21 else 22,
                username=self.config.username,
                password=self.config.password,
                timeout=self.config.timeout,
            )

            self.sftp_client = self.ssh_client.open_sftp()

            # Change to base directory
            if self.config.remote_base_path != "/":
                self.sftp_client.chdir(self.config.remote_base_path)

            self.logger.info(f"SFTP connection established to {self.config.host}")
            self.is_connected = True
            return True

        except Exception as e:
            self.logger.error(f"Failed to connect via SFTP: {e}")
            self.is_connected = False
            return False

    def disconnect(self) -> None:
        """Close FTP/SFTP connection"""
        try:
            if self.ftp_client:
                self.ftp_client.quit()
                self.ftp_client = None

            if self.sftp_client:
                self.sftp_client.close()
                self.sftp_client = None

            if self.ssh_client:
                self.ssh_client.close()
                self.ssh_client = None

            self.is_connected = False
            self.logger.info("FTP/SFTP connection closed")

        except Exception as e:
            self.logger.warning(f"Error closing connection: {e}")

    def _ensure_connected(self) -> bool:
        """Ensure connection is active, reconnect if necessary"""
        if not self.is_connected:
            return self.connect() or self.connect_sftp()

        # Test connection
        try:
            if self.ftp_client:
                self.ftp_client.voidcmd("NOOP")
            elif self.sftp_client:
                self.sftp_client.listdir(".")
            return True
        except Exception:
            self.is_connected = False
            return self.connect() or self.connect_sftp()

    def upload_file(
        self, local_path: str, remote_path: str, create_dirs: bool = True
    ) -> TransferResult:
        """
        Upload file to FTP server

        Args:
            local_path: Local file path
            remote_path: Remote file path
            create_dirs: Whether to create remote directories

        Returns:
            TransferResult: Transfer operation result
        """
        start_time = time.time()
        local_file = Path(local_path)

        if not local_file.exists():
            return TransferResult(
                success=False,
                local_path=local_path,
                remote_path=remote_path,
                error_message=f"Local file does not exist: {local_path}",
            )

        if not self._ensure_connected():
            return TransferResult(
                success=False,
                local_path=local_path,
                remote_path=remote_path,
                error_message="Could not establish connection",
            )

        try:
            # Create remote directories if needed
            if create_dirs:
                self._create_remote_dirs(remote_path)

            file_size = local_file.stat().st_size

            with open(local_path, "rb") as local_file_obj:
                if self.ftp_client:
                    # FTP upload
                    self.ftp_client.storbinary(f"STOR {remote_path}", local_file_obj)
                elif self.sftp_client:
                    # SFTP upload
                    self.sftp_client.putfo(local_file_obj, remote_path)
                else:
                    raise Exception("No active connection")

            transfer_time = time.time() - start_time

            self.logger.info(
                f"Uploaded {local_path} to {remote_path} "
                f"({file_size} bytes in {transfer_time:.2f}s)"
            )

            return TransferResult(
                success=True,
                local_path=local_path,
                remote_path=remote_path,
                size_bytes=file_size,
                transfer_time=transfer_time,
            )

        except Exception as e:
            transfer_time = time.time() - start_time
            error_msg = f"Upload failed: {e}"
            self.logger.error(error_msg)

            return TransferResult(
                success=False,
                local_path=local_path,
                remote_path=remote_path,
                transfer_time=transfer_time,
                error_message=error_msg,
            )

    def download_file(
        self, remote_path: str, local_path: str, create_dirs: bool = True
    ) -> TransferResult:
        """
        Download file from FTP server

        Args:
            remote_path: Remote file path
            local_path: Local file path
            create_dirs: Whether to create local directories

        Returns:
            TransferResult: Transfer operation result
        """
        start_time = time.time()

        if not self._ensure_connected():
            return TransferResult(
                success=False,
                local_path=local_path,
                remote_path=remote_path,
                error_message="Could not establish connection",
            )

        try:
            # Create local directories if needed
            if create_dirs:
                Path(local_path).parent.mkdir(parents=True, exist_ok=True)

            with open(local_path, "wb") as local_file_obj:
                if self.ftp_client:
                    # FTP download
                    self.ftp_client.retrbinary(f"RETR {remote_path}", local_file_obj.write)
                elif self.sftp_client:
                    # SFTP download
                    self.sftp_client.getfo(remote_path, local_file_obj)
                else:
                    raise Exception("No active connection")

            file_size = Path(local_path).stat().st_size
            transfer_time = time.time() - start_time

            self.logger.info(
                f"Downloaded {remote_path} to {local_path} "
                f"({file_size} bytes in {transfer_time:.2f}s)"
            )

            return TransferResult(
                success=True,
                local_path=local_path,
                remote_path=remote_path,
                size_bytes=file_size,
                transfer_time=transfer_time,
            )

        except Exception as e:
            transfer_time = time.time() - start_time
            error_msg = f"Download failed: {e}"
            self.logger.error(error_msg)

            return TransferResult(
                success=False,
                local_path=local_path,
                remote_path=remote_path,
                transfer_time=transfer_time,
                error_message=error_msg,
            )

    def list_files(self, remote_path: str = ".") -> List[Dict[str, Any]]:
        """
        List files and directories in remote path

        Args:
            remote_path: Remote directory path

        Returns:
            List[Dict]: List of file/directory information
        """
        if not self._ensure_connected():
            return []

        try:
            files = []

            if self.ftp_client:
                # FTP listing
                file_list = []
                self.ftp_client.retrlines(f"LIST {remote_path}", file_list.append)

                for line in file_list:
                    parts = line.split()
                    if len(parts) >= 9:
                        is_dir = line.startswith("d")
                        name = " ".join(parts[8:])
                        size = 0 if is_dir else int(parts[4])

                        files.append(
                            {
                                "name": name,
                                "size": size,
                                "is_directory": is_dir,
                                "path": f"{remote_path}/{name}".replace("//", "/"),
                            }
                        )

            elif self.sftp_client:
                # SFTP listing
                for item in self.sftp_client.listdir_attr(remote_path):
                    files.append(
                        {
                            "name": item.filename,
                            "size": item.st_size or 0,
                            "is_directory": item.st_mode and (item.st_mode & 0o170000) == 0o040000,
                            "path": f"{remote_path}/{item.filename}".replace("//", "/"),
                        }
                    )

            return files

        except Exception as e:
            self.logger.error(f"Failed to list files in {remote_path}: {e}")
            return []

    def file_exists(self, remote_path: str) -> bool:
        """
        Check if file exists on remote server

        Args:
            remote_path: Remote file path

        Returns:
            bool: True if file exists
        """
        if not self._ensure_connected():
            return False

        try:
            if self.ftp_client:
                # Try to get file size
                self.ftp_client.size(remote_path)
                return True
            elif self.sftp_client:
                # Try to get file stats
                self.sftp_client.stat(remote_path)
                return True

        except Exception:
            return False

        return False

    def delete_file(self, remote_path: str) -> bool:
        """
        Delete file from remote server

        Args:
            remote_path: Remote file path

        Returns:
            bool: True if deletion successful
        """
        if not self._ensure_connected():
            return False

        try:
            if self.ftp_client:
                self.ftp_client.delete(remote_path)
            elif self.sftp_client:
                self.sftp_client.remove(remote_path)
            else:
                return False

            self.logger.info(f"Deleted remote file: {remote_path}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to delete {remote_path}: {e}")
            return False

    def _create_remote_dirs(self, remote_file_path: str) -> None:
        """Create remote directories for file path"""
        remote_dir = str(Path(remote_file_path).parent)
        if remote_dir == "." or remote_dir == "/":
            return

        try:
            if self.ftp_client:
                # Try to create directory
                try:
                    self.ftp_client.mkd(remote_dir)
                except ftplib.error_perm:
                    # Directory might already exist
                    pass
            elif self.sftp_client:
                # SFTP mkdir with recursive creation
                self._sftp_makedirs(remote_dir)

        except Exception as e:
            self.logger.warning(f"Could not create remote directory {remote_dir}: {e}")

    def _sftp_makedirs(self, remote_dir: str) -> None:
        """Recursively create SFTP directories"""
        if remote_dir == "/" or remote_dir == ".":
            return

        try:
            self.sftp_client.stat(remote_dir)
        except FileNotFoundError:
            # Directory doesn't exist, create parent first
            parent = str(Path(remote_dir).parent)
            if parent != remote_dir:
                self._sftp_makedirs(parent)

            try:
                self.sftp_client.mkdir(remote_dir)
            except Exception as e:
                self.logger.warning(f"Could not create SFTP directory {remote_dir}: {e}")


class FTPClientManager:
    """Manager for FTP client connections with retry logic"""

    def __init__(self, config_manager: ConfigManager):
        """
        Initialize FTP client manager

        Args:
            config_manager: Configuration manager instance
        """
        self.config_manager = config_manager
        self.logger = logging.getLogger(__name__)
        self._client: Optional[SecureFTPClient] = None

    def get_client(self) -> Optional[SecureFTPClient]:
        """Get FTP client instance with connection retry"""
        if self._client is None:
            self._client = SecureFTPClient(self.config_manager.ftp_config)

        if not self._client.is_connected:
            if not self._client.connect():
                if not self._client.connect_sftp():
                    self.logger.error("Could not establish FTP or SFTP connection")
                    return None

        return self._client

    def close_connection(self) -> None:
        """Close FTP connection"""
        if self._client:
            self._client.disconnect()
            self._client = None
