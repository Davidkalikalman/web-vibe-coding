"""
Comprehensive Logging Setup for Multilingual Text Management System

Provides structured logging with multiple handlers, formatters, and monitoring
capabilities for production-ready translation operations.
"""

import os
import logging
import logging.handlers
import json
import sys
from typing import Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import colorlog


class TranslationSystemLogger:
    """Enhanced logger for translation system operations"""

    def __init__(
        self,
        name: str = "translation_system",
        log_level: str = "INFO",
        log_dir: str = "logs",
        enable_console: bool = True,
        enable_file: bool = True,
        enable_json: bool = True,
        max_bytes: int = 10 * 1024 * 1024,  # 10MB
        backup_count: int = 5,
    ):
        """
        Initialize comprehensive logging system

        Args:
            name: Logger name
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            log_dir: Directory for log files
            enable_console: Enable colored console output
            enable_file: Enable file logging
            enable_json: Enable structured JSON logging
            max_bytes: Maximum size per log file
            backup_count: Number of backup files to keep
        """
        self.name = name
        self.log_level = getattr(logging, log_level.upper())
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)

        # Create main logger
        self.logger = logging.getLogger(name)
        self.logger.setLevel(self.log_level)

        # Clear any existing handlers
        self.logger.handlers.clear()

        # Add handlers
        if enable_console:
            self._add_console_handler()

        if enable_file:
            self._add_file_handler(max_bytes, backup_count)

        if enable_json:
            self._add_json_handler(max_bytes, backup_count)

        # Prevent propagation to root logger
        self.logger.propagate = False

    def _add_console_handler(self) -> None:
        """Add colored console handler"""
        console_handler = colorlog.StreamHandler(sys.stdout)
        console_handler.setLevel(self.log_level)

        # Colored formatter for console
        console_formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            log_colors={
                "DEBUG": "cyan",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "CRITICAL": "red,bg_white",
            },
        )

        console_handler.setFormatter(console_formatter)
        self.logger.addHandler(console_handler)

    def _add_file_handler(self, max_bytes: int, backup_count: int) -> None:
        """Add rotating file handler"""
        file_path = self.log_dir / f"{self.name}.log"

        file_handler = logging.handlers.RotatingFileHandler(
            file_path, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
        )
        file_handler.setLevel(self.log_level)

        # Standard formatter for file
        file_formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        file_handler.setFormatter(file_formatter)
        self.logger.addHandler(file_handler)

    def _add_json_handler(self, max_bytes: int, backup_count: int) -> None:
        """Add JSON structured logging handler"""
        json_path = self.log_dir / f"{self.name}.json"

        json_handler = logging.handlers.RotatingFileHandler(
            json_path, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
        )
        json_handler.setLevel(self.log_level)

        # JSON formatter
        json_formatter = JsonFormatter()
        json_handler.setFormatter(json_formatter)
        self.logger.addHandler(json_handler)

    def get_logger(self) -> logging.Logger:
        """Get configured logger instance"""
        return self.logger


class JsonFormatter(logging.Formatter):
    """JSON formatter for structured logging"""

    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON"""
        # Base log data
        log_data = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "message": record.getMessage(),
        }

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields from record
        for key, value in record.__dict__.items():
            if key not in [
                "name",
                "msg",
                "args",
                "levelname",
                "levelno",
                "pathname",
                "filename",
                "module",
                "lineno",
                "funcName",
                "created",
                "msecs",
                "relativeCreated",
                "thread",
                "threadName",
                "processName",
                "process",
                "getMessage",
                "exc_info",
                "exc_text",
                "stack_info",
            ]:
                log_data[key] = value

        return json.dumps(log_data, ensure_ascii=False)


class WorkflowLogger:
    """Specialized logger for workflow operations"""

    def __init__(self, workflow_id: str, base_logger: logging.Logger):
        """
        Initialize workflow logger

        Args:
            workflow_id: Unique workflow identifier
            base_logger: Base logger instance
        """
        self.workflow_id = workflow_id
        self.base_logger = base_logger
        self.start_time = datetime.now()
        self.operation_count = 0

    def _log_with_context(self, level: int, message: str, **kwargs) -> None:
        """Log message with workflow context"""
        self.operation_count += 1

        extra = {
            "workflow_id": self.workflow_id,
            "operation_count": self.operation_count,
            "elapsed_time": (datetime.now() - self.start_time).total_seconds(),
            **kwargs,
        }

        self.base_logger.log(level, message, extra=extra)

    def debug(self, message: str, **kwargs) -> None:
        """Log debug message"""
        self._log_with_context(logging.DEBUG, message, **kwargs)

    def info(self, message: str, **kwargs) -> None:
        """Log info message"""
        self._log_with_context(logging.INFO, message, **kwargs)

    def warning(self, message: str, **kwargs) -> None:
        """Log warning message"""
        self._log_with_context(logging.WARNING, message, **kwargs)

    def error(self, message: str, **kwargs) -> None:
        """Log error message"""
        self._log_with_context(logging.ERROR, message, **kwargs)

    def critical(self, message: str, **kwargs) -> None:
        """Log critical message"""
        self._log_with_context(logging.CRITICAL, message, **kwargs)

    def file_processed(
        self,
        file_path: str,
        success: bool,
        translations_count: int = 0,
        processing_time: float = 0.0,
        error_message: Optional[str] = None,
    ) -> None:
        """Log file processing result"""
        self.info(
            f"File processed: {file_path}",
            file_path=file_path,
            success=success,
            translations_count=translations_count,
            processing_time=processing_time,
            error_message=error_message,
            operation_type="file_processing",
        )

    def translation_completed(
        self,
        text_length: int,
        source_lang: str,
        target_lang: str,
        service: str,
        success: bool,
        processing_time: float = 0.0,
        cached: bool = False,
        error_message: Optional[str] = None,
    ) -> None:
        """Log translation operation"""
        level = logging.INFO if success else logging.ERROR
        message = f"Translation: {source_lang} -> {target_lang} ({'cached' if cached else service})"

        self._log_with_context(
            level,
            message,
            text_length=text_length,
            source_language=source_lang,
            target_language=target_lang,
            service=service,
            success=success,
            processing_time=processing_time,
            cached=cached,
            error_message=error_message,
            operation_type="translation",
        )

    def ftp_operation(
        self,
        operation: str,
        local_path: str,
        remote_path: str,
        success: bool,
        file_size: int = 0,
        transfer_time: float = 0.0,
        error_message: Optional[str] = None,
    ) -> None:
        """Log FTP operation"""
        level = logging.INFO if success else logging.ERROR
        message = f"FTP {operation}: {local_path} -> {remote_path}"

        self._log_with_context(
            level,
            message,
            ftp_operation=operation,
            local_path=local_path,
            remote_path=remote_path,
            success=success,
            file_size=file_size,
            transfer_time=transfer_time,
            error_message=error_message,
            operation_type="ftp",
        )

    def workflow_summary(
        self,
        total_files: int,
        processed_files: int,
        failed_files: int,
        total_translations: int,
        uploaded_files: int,
        total_time: float,
    ) -> None:
        """Log workflow completion summary"""
        success_rate = (processed_files / total_files * 100) if total_files > 0 else 0

        self.info(
            f"Workflow completed: {processed_files}/{total_files} files processed",
            total_files=total_files,
            processed_files=processed_files,
            failed_files=failed_files,
            total_translations=total_translations,
            uploaded_files=uploaded_files,
            total_time=total_time,
            success_rate=success_rate,
            operation_type="workflow_summary",
        )


class PerformanceLogger:
    """Logger for performance monitoring and metrics"""

    def __init__(self, base_logger: logging.Logger):
        """
        Initialize performance logger

        Args:
            base_logger: Base logger instance
        """
        self.base_logger = base_logger
        self.metrics: Dict[str, Any] = {}

    def log_performance_metric(
        self, metric_name: str, value: float, unit: str = "", **context
    ) -> None:
        """Log performance metric"""
        self.base_logger.info(
            f"Performance metric: {metric_name} = {value}{unit}",
            extra={
                "metric_name": metric_name,
                "metric_value": value,
                "metric_unit": unit,
                "operation_type": "performance_metric",
                **context,
            },
        )

        # Store in memory for aggregation
        if metric_name not in self.metrics:
            self.metrics[metric_name] = []
        self.metrics[metric_name].append(value)

    def log_timing(self, operation_name: str, duration: float, **context) -> None:
        """Log operation timing"""
        self.log_performance_metric(
            f"{operation_name}_duration", duration, "s", operation_name=operation_name, **context
        )

    def log_throughput(
        self, operation_name: str, items_count: int, duration: float, **context
    ) -> None:
        """Log throughput metric"""
        throughput = items_count / duration if duration > 0 else 0

        self.log_performance_metric(
            f"{operation_name}_throughput",
            throughput,
            "items/s",
            operation_name=operation_name,
            items_count=items_count,
            duration=duration,
            **context,
        )

    def get_metric_summary(self, metric_name: str) -> Dict[str, float]:
        """Get summary statistics for a metric"""
        if metric_name not in self.metrics or not self.metrics[metric_name]:
            return {}

        values = self.metrics[metric_name]
        return {
            "count": len(values),
            "min": min(values),
            "max": max(values),
            "avg": sum(values) / len(values),
            "total": sum(values),
        }


def setup_logging(config_dict: Optional[Dict[str, Any]] = None) -> logging.Logger:
    """
    Setup comprehensive logging system

    Args:
        config_dict: Optional configuration dictionary

    Returns:
        logging.Logger: Configured logger instance
    """
    if config_dict is None:
        config_dict = {}

    # Default configuration
    default_config = {
        "name": "translation_system",
        "log_level": os.getenv("LOG_LEVEL", "INFO"),
        "log_dir": os.getenv("LOG_DIR", "logs"),
        "enable_console": os.getenv("ENABLE_CONSOLE_LOG", "true").lower() == "true",
        "enable_file": os.getenv("ENABLE_FILE_LOG", "true").lower() == "true",
        "enable_json": os.getenv("ENABLE_JSON_LOG", "true").lower() == "true",
        "max_bytes": int(os.getenv("LOG_MAX_BYTES", str(10 * 1024 * 1024))),
        "backup_count": int(os.getenv("LOG_BACKUP_COUNT", "5")),
    }

    # Merge with provided config
    config = {**default_config, **config_dict}

    # Setup logger
    logger_setup = TranslationSystemLogger(**config)
    return logger_setup.get_logger()


def get_workflow_logger(
    workflow_id: str, base_logger: Optional[logging.Logger] = None
) -> WorkflowLogger:
    """
    Get workflow-specific logger

    Args:
        workflow_id: Unique workflow identifier
        base_logger: Base logger (if None, creates default)

    Returns:
        WorkflowLogger: Workflow-specific logger
    """
    if base_logger is None:
        base_logger = setup_logging()

    return WorkflowLogger(workflow_id, base_logger)


def get_performance_logger(base_logger: Optional[logging.Logger] = None) -> PerformanceLogger:
    """
    Get performance logger

    Args:
        base_logger: Base logger (if None, creates default)

    Returns:
        PerformanceLogger: Performance monitoring logger
    """
    if base_logger is None:
        base_logger = setup_logging()

    return PerformanceLogger(base_logger)


# Context manager for timing operations
class LoggedTimer:
    """Context manager for logging operation timing"""

    def __init__(self, logger: WorkflowLogger, operation_name: str, **context):
        """
        Initialize logged timer

        Args:
            logger: Workflow logger instance
            operation_name: Name of operation being timed
            context: Additional context data
        """
        self.logger = logger
        self.operation_name = operation_name
        self.context = context
        self.start_time = None

    def __enter__(self):
        """Start timing"""
        self.start_time = datetime.now()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """End timing and log result"""
        if self.start_time:
            duration = (datetime.now() - self.start_time).total_seconds()

            if exc_type is None:
                self.logger.info(
                    f"Operation completed: {self.operation_name} ({duration:.2f}s)",
                    operation_name=self.operation_name,
                    duration=duration,
                    success=True,
                    **self.context,
                )
            else:
                self.logger.error(
                    f"Operation failed: {self.operation_name} ({duration:.2f}s)",
                    operation_name=self.operation_name,
                    duration=duration,
                    success=False,
                    exception_type=exc_type.__name__ if exc_type else None,
                    exception_message=str(exc_val) if exc_val else None,
                    **self.context,
                )


# Usage example functions
def log_system_info(logger: logging.Logger) -> None:
    """Log system information for debugging"""
    import platform
    import psutil

    logger.info(
        "System Information",
        extra={
            "python_version": platform.python_version(),
            "platform": platform.platform(),
            "cpu_count": psutil.cpu_count(),
            "memory_total": psutil.virtual_memory().total,
            "memory_available": psutil.virtual_memory().available,
            "operation_type": "system_info",
        },
    )


def create_error_report(logger: logging.Logger, error: Exception, context: Dict[str, Any]) -> None:
    """Create detailed error report"""
    import traceback

    error_details = {
        "error_type": type(error).__name__,
        "error_message": str(error),
        "traceback": traceback.format_exc(),
        "operation_type": "error_report",
        **context,
    }

    logger.error(f"Detailed error report: {error_details['error_type']}", extra=error_details)
