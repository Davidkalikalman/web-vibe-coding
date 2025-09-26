"""
Main Translation Workflow for Multilingual Text Management System

Orchestrates the complete translation process including FTP operations,
file processing, translation, and deployment with comprehensive error handling.
"""

import time
import logging
import concurrent.futures
from typing import List, Dict, Optional, Any, Tuple
from pathlib import Path
from dataclasses import dataclass, field
from datetime import datetime

from core.config_manager import ConfigManager
from services.ftp_client import FTPClientManager, TransferResult
from services.translation_service import TranslationService
from services.file_processor import FileProcessorManager, FileProcessingResult


@dataclass
class WorkflowResult:
    """Result of complete translation workflow"""

    workflow_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    success: bool = False
    total_files: int = 0
    processed_files: int = 0
    failed_files: int = 0
    total_translations: int = 0
    uploaded_files: int = 0
    error_messages: List[str] = field(default_factory=list)
    file_results: List[FileProcessingResult] = field(default_factory=list)
    upload_results: List[TransferResult] = field(default_factory=list)

    @property
    def processing_time(self) -> float:
        """Get total processing time in seconds"""
        if self.end_time and self.start_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0.0

    @property
    def success_rate(self) -> float:
        """Get success rate as percentage"""
        if self.total_files == 0:
            return 0.0
        return (self.processed_files / self.total_files) * 100


@dataclass
class WorkflowConfig:
    """Configuration for translation workflow"""

    input_directory: str
    output_directory: Optional[str] = None
    ftp_upload: bool = True
    ftp_download: bool = False
    backup_original: bool = True
    parallel_processing: bool = True
    max_workers: int = 4
    file_patterns: List[str] = field(default_factory=lambda: ["*.txt", "*.md", "*.html", "*.json"])
    exclude_patterns: List[str] = field(default_factory=list)
    remote_upload_path: str = "translations"
    cleanup_temp_files: bool = True


class TranslationWorkflow:
    """Main translation workflow orchestrator"""

    def __init__(self, config_manager: ConfigManager):
        """
        Initialize translation workflow

        Args:
            config_manager: Configuration manager instance
        """
        self.config_manager = config_manager
        self.logger = logging.getLogger(__name__)

        # Initialize services
        self.ftp_manager = FTPClientManager(config_manager)
        self.translation_service = TranslationService(config_manager)
        self.file_processor = FileProcessorManager(config_manager, self.translation_service)

        # Workflow state
        self.current_workflow: Optional[WorkflowResult] = None

    def execute_workflow(self, workflow_config: WorkflowConfig) -> WorkflowResult:
        """
        Execute complete translation workflow

        Args:
            workflow_config: Workflow configuration

        Returns:
            WorkflowResult: Complete workflow result
        """
        workflow_id = f"workflow_{int(time.time())}"
        start_time = datetime.now()

        self.logger.info(f"Starting translation workflow: {workflow_id}")

        # Initialize workflow result
        result = WorkflowResult(workflow_id=workflow_id, start_time=start_time)
        self.current_workflow = result

        try:
            # Step 1: Discover files
            files_to_process = self._discover_files(workflow_config)
            result.total_files = len(files_to_process)

            if not files_to_process:
                self.logger.warning("No files found to process")
                result.end_time = datetime.now()
                return result

            self.logger.info(f"Found {len(files_to_process)} files to process")

            # Step 2: Download files from FTP (if configured)
            if workflow_config.ftp_download:
                downloaded_files = self._download_files_from_ftp(files_to_process, workflow_config)
                files_to_process = downloaded_files

            # Step 3: Process files (translate)
            if workflow_config.parallel_processing:
                file_results = self._process_files_parallel(files_to_process, workflow_config)
            else:
                file_results = self._process_files_sequential(files_to_process, workflow_config)

            result.file_results = file_results
            result.processed_files = sum(1 for r in file_results if r.success)
            result.failed_files = sum(1 for r in file_results if not r.success)
            result.total_translations = sum(r.translations_count for r in file_results if r.success)

            # Step 4: Upload translated files to FTP (if configured)
            if workflow_config.ftp_upload:
                upload_results = self._upload_files_to_ftp(file_results, workflow_config)
                result.upload_results = upload_results
                result.uploaded_files = sum(1 for r in upload_results if r.success)

            # Step 5: Cleanup (if configured)
            if workflow_config.cleanup_temp_files:
                self._cleanup_temp_files(file_results, workflow_config)

            result.success = result.failed_files == 0

        except Exception as e:
            error_msg = f"Workflow execution failed: {e}"
            self.logger.error(error_msg)
            result.error_messages.append(error_msg)
            result.success = False

        finally:
            result.end_time = datetime.now()
            self.current_workflow = None

            # Log workflow summary
            self._log_workflow_summary(result)

        return result

    def _discover_files(self, config: WorkflowConfig) -> List[str]:
        """Discover files to process based on configuration"""
        input_path = Path(config.input_directory)

        if not input_path.exists():
            raise FileNotFoundError(f"Input directory does not exist: {input_path}")

        files = []

        # Collect files based on patterns
        for pattern in config.file_patterns:
            if input_path.is_file():
                files.append(str(input_path))
            else:
                files.extend([str(f) for f in input_path.rglob(pattern)])

        # Filter supported files
        supported_files = [f for f in files if self.config_manager.is_supported_file(f)]

        # Apply exclude patterns
        if config.exclude_patterns:
            filtered_files = []
            for file_path in supported_files:
                should_exclude = False
                for exclude_pattern in config.exclude_patterns:
                    if Path(file_path).match(exclude_pattern):
                        should_exclude = True
                        break

                if not should_exclude:
                    filtered_files.append(file_path)

            supported_files = filtered_files

        return list(set(supported_files))  # Remove duplicates

    def _download_files_from_ftp(self, files: List[str], config: WorkflowConfig) -> List[str]:
        """Download files from FTP server"""
        self.logger.info("Downloading files from FTP server")

        ftp_client = self.ftp_manager.get_client()
        if not ftp_client:
            raise ConnectionError("Could not establish FTP connection for download")

        downloaded_files = []
        temp_dir = Path(config.output_directory or "temp") / "downloads"
        temp_dir.mkdir(parents=True, exist_ok=True)

        for remote_file in files:
            local_file = temp_dir / Path(remote_file).name

            result = ftp_client.download_file(remote_file, str(local_file))
            if result.success:
                downloaded_files.append(str(local_file))
                self.logger.info(f"Downloaded: {remote_file} -> {local_file}")
            else:
                self.logger.error(f"Download failed: {remote_file} - {result.error_message}")

        return downloaded_files

    def _process_files_sequential(
        self, files: List[str], config: WorkflowConfig
    ) -> List[FileProcessingResult]:
        """Process files sequentially"""
        self.logger.info("Processing files sequentially")

        results = []
        output_dir = config.output_directory or str(Path(files[0]).parent / "translations")

        for i, file_path in enumerate(files, 1):
            self.logger.info(f"Processing file {i}/{len(files)}: {file_path}")

            try:
                result = self.file_processor.process_file(file_path, output_dir)
                results.append(result)

                if result.success:
                    self.logger.info(
                        f"Successfully processed: {file_path} "
                        f"({result.translations_count} translations)"
                    )
                else:
                    self.logger.error(f"Failed to process: {file_path} - {result.error_message}")

            except Exception as e:
                error_msg = f"Error processing {file_path}: {e}"
                self.logger.error(error_msg)

                results.append(
                    FileProcessingResult(
                        file_path=file_path, success=False, error_message=error_msg
                    )
                )

        return results

    def _process_files_parallel(
        self, files: List[str], config: WorkflowConfig
    ) -> List[FileProcessingResult]:
        """Process files in parallel"""
        self.logger.info(f"Processing files in parallel with {config.max_workers} workers")

        output_dir = config.output_directory or str(Path(files[0]).parent / "translations")

        with concurrent.futures.ThreadPoolExecutor(max_workers=config.max_workers) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(self.file_processor.process_file, file_path, output_dir): file_path
                for file_path in files
            }

            results = []
            completed = 0

            for future in concurrent.futures.as_completed(future_to_file):
                file_path = future_to_file[future]
                completed += 1

                try:
                    result = future.result()
                    results.append(result)

                    if result.success:
                        self.logger.info(
                            f"[{completed}/{len(files)}] Successfully processed: {file_path} "
                            f"({result.translations_count} translations)"
                        )
                    else:
                        self.logger.error(
                            f"[{completed}/{len(files)}] Failed to process: {file_path} "
                            f"- {result.error_message}"
                        )

                except Exception as e:
                    error_msg = f"Error processing {file_path}: {e}"
                    self.logger.error(f"[{completed}/{len(files)}] {error_msg}")

                    results.append(
                        FileProcessingResult(
                            file_path=file_path, success=False, error_message=error_msg
                        )
                    )

        return results

    def _upload_files_to_ftp(
        self, file_results: List[FileProcessingResult], config: WorkflowConfig
    ) -> List[TransferResult]:
        """Upload translated files to FTP server"""
        self.logger.info("Uploading translated files to FTP server")

        ftp_client = self.ftp_manager.get_client()
        if not ftp_client:
            self.logger.error("Could not establish FTP connection for upload")
            return []

        upload_results = []

        for file_result in file_results:
            if not file_result.success or not file_result.translated_files:
                continue

            for translated_file in file_result.translated_files:
                # Generate remote path
                file_name = Path(translated_file).name
                remote_path = f"{config.remote_upload_path}/{file_name}"

                # Upload file
                result = ftp_client.upload_file(translated_file, remote_path)
                upload_results.append(result)

                if result.success:
                    self.logger.info(f"Uploaded: {translated_file} -> {remote_path}")
                else:
                    self.logger.error(f"Upload failed: {translated_file} - {result.error_message}")

        return upload_results

    def _cleanup_temp_files(
        self, file_results: List[FileProcessingResult], config: WorkflowConfig
    ) -> None:
        """Clean up temporary files"""
        self.logger.info("Cleaning up temporary files")

        temp_dir = Path(config.output_directory or "temp") / "downloads"

        if temp_dir.exists():
            try:
                import shutil

                shutil.rmtree(temp_dir)
                self.logger.info(f"Cleaned up temporary directory: {temp_dir}")
            except Exception as e:
                self.logger.warning(f"Could not clean up temporary directory: {e}")

    def _log_workflow_summary(self, result: WorkflowResult) -> None:
        """Log workflow execution summary"""
        self.logger.info(f"Workflow {result.workflow_id} completed:")
        self.logger.info(f"  Success: {result.success}")
        self.logger.info(f"  Processing time: {result.processing_time:.2f}s")
        self.logger.info(f"  Total files: {result.total_files}")
        self.logger.info(f"  Processed files: {result.processed_files}")
        self.logger.info(f"  Failed files: {result.failed_files}")
        self.logger.info(f"  Total translations: {result.total_translations}")
        self.logger.info(f"  Uploaded files: {result.uploaded_files}")
        self.logger.info(f"  Success rate: {result.success_rate:.1f}%")

        if result.error_messages:
            self.logger.error("Errors encountered:")
            for error in result.error_messages:
                self.logger.error(f"  - {error}")

    def get_workflow_status(self) -> Optional[Dict[str, Any]]:
        """Get current workflow status"""
        if not self.current_workflow:
            return None

        return {
            "workflow_id": self.current_workflow.workflow_id,
            "start_time": self.current_workflow.start_time.isoformat(),
            "processing_time": (datetime.now() - self.current_workflow.start_time).total_seconds(),
            "total_files": self.current_workflow.total_files,
            "processed_files": self.current_workflow.processed_files,
            "failed_files": self.current_workflow.failed_files,
            "success_rate": self.current_workflow.success_rate,
        }


class BatchTranslationWorkflow(TranslationWorkflow):
    """Extended workflow for batch operations and scheduling"""

    def __init__(self, config_manager: ConfigManager):
        super().__init__(config_manager)
        self.scheduled_workflows: List[Tuple[datetime, WorkflowConfig]] = []

    def schedule_workflow(self, workflow_config: WorkflowConfig, scheduled_time: datetime) -> None:
        """Schedule workflow for future execution"""
        self.scheduled_workflows.append((scheduled_time, workflow_config))
        self.logger.info(f"Scheduled workflow for {scheduled_time}")

    def execute_scheduled_workflows(self) -> List[WorkflowResult]:
        """Execute all scheduled workflows that are due"""
        current_time = datetime.now()
        due_workflows = []
        remaining_workflows = []

        for scheduled_time, config in self.scheduled_workflows:
            if scheduled_time <= current_time:
                due_workflows.append(config)
            else:
                remaining_workflows.append((scheduled_time, config))

        self.scheduled_workflows = remaining_workflows

        results = []
        for config in due_workflows:
            result = self.execute_workflow(config)
            results.append(result)

        return results

    def execute_directory_batch(
        self, base_directory: str, recursive: bool = True
    ) -> List[WorkflowResult]:
        """Execute batch translation for multiple directories"""
        base_path = Path(base_directory)

        if not base_path.exists():
            raise FileNotFoundError(f"Base directory does not exist: {base_path}")

        results = []

        if recursive:
            # Find all subdirectories with supported files
            subdirectories = [
                d
                for d in base_path.rglob("*")
                if d.is_dir()
                and any(
                    self.config_manager.is_supported_file(str(f))
                    for f in d.iterdir()
                    if f.is_file()
                )
            ]
        else:
            subdirectories = [
                d
                for d in base_path.iterdir()
                if d.is_dir()
                and any(
                    self.config_manager.is_supported_file(str(f))
                    for f in d.iterdir()
                    if f.is_file()
                )
            ]

        for directory in subdirectories:
            self.logger.info(f"Processing directory: {directory}")

            config = WorkflowConfig(
                input_directory=str(directory),
                output_directory=str(directory / "translations"),
                remote_upload_path=f"translations/{directory.name}",
            )

            result = self.execute_workflow(config)
            results.append(result)

        return results


# Utility functions for workflow management
def create_simple_workflow_config(input_dir: str, **kwargs) -> WorkflowConfig:
    """Create a simple workflow configuration with defaults"""
    return WorkflowConfig(input_directory=input_dir, **kwargs)


def run_translation_workflow(
    config_file: Optional[str] = None, input_directory: str = "input", **workflow_kwargs
) -> WorkflowResult:
    """Run a simple translation workflow with minimal setup"""
    config_manager = ConfigManager(config_file)
    workflow = TranslationWorkflow(config_manager)

    workflow_config = create_simple_workflow_config(input_directory, **workflow_kwargs)

    return workflow.execute_workflow(workflow_config)
