"""
Main CLI Application for Multilingual Text Management System

Command-line interface for executing translation workflows with various options
and configurations for FTP-based multilingual content management.
"""

import sys
import argparse
import signal
from typing import Optional
from pathlib import Path
import json

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from core.config_manager import ConfigManager
from core.translation_workflow import TranslationWorkflow, BatchTranslationWorkflow, WorkflowConfig
from utils.logging_setup import setup_logging, log_system_info


class TranslationSystemCLI:
    """Command-line interface for the translation system"""

    def __init__(self):
        """Initialize CLI application"""
        self.config_manager: Optional[ConfigManager] = None
        self.workflow: Optional[TranslationWorkflow] = None
        self.logger = None
        self.interrupted = False

        # Setup signal handling
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)

    def _signal_handler(self, signum, frame):
        """Handle interrupt signals gracefully"""
        print("\nReceived interrupt signal. Shutting down gracefully...")
        self.interrupted = True

        if self.workflow and self.workflow.ftp_manager:
            self.workflow.ftp_manager.close_connection()

        sys.exit(0)

    def setup_logging(self, args: argparse.Namespace) -> None:
        """Setup logging based on CLI arguments"""
        log_config = {
            "log_level": args.log_level,
            "log_dir": args.log_dir,
            "enable_console": not args.quiet,
            "enable_file": args.log_file,
            "enable_json": args.json_logs,
        }

        self.logger = setup_logging(log_config)

        if args.verbose:
            log_system_info(self.logger)

    def load_config(self, config_file: Optional[str] = None) -> None:
        """Load configuration"""
        try:
            self.config_manager = ConfigManager(config_file)
            self.logger.info(f"Configuration loaded from {config_file or 'environment variables'}")
        except Exception as e:
            self.logger.error(f"Failed to load configuration: {e}")
            sys.exit(1)

    def create_workflow(self, batch_mode: bool = False) -> None:
        """Create workflow instance"""
        if batch_mode:
            self.workflow = BatchTranslationWorkflow(self.config_manager)
        else:
            self.workflow = TranslationWorkflow(self.config_manager)

    def execute_single_workflow(self, args: argparse.Namespace) -> int:
        """Execute single translation workflow"""
        try:
            # Create workflow configuration
            config = WorkflowConfig(
                input_directory=args.input,
                output_directory=args.output,
                ftp_upload=args.ftp_upload,
                ftp_download=args.ftp_download,
                backup_original=args.backup,
                parallel_processing=args.parallel,
                max_workers=args.workers,
                file_patterns=args.patterns
                if args.patterns
                else ["*.txt", "*.md", "*.html", "*.json"],
                exclude_patterns=args.exclude if args.exclude else [],
                remote_upload_path=args.remote_path,
                cleanup_temp_files=args.cleanup,
            )

            self.logger.info(f"Starting translation workflow for: {args.input}")

            # Execute workflow
            result = self.workflow.execute_workflow(config)

            # Output results
            if args.output_format == "json":
                self._output_json_result(result)
            else:
                self._output_text_result(result)

            return 0 if result.success else 1

        except KeyboardInterrupt:
            self.logger.info("Workflow interrupted by user")
            return 130
        except Exception as e:
            self.logger.error(f"Workflow execution failed: {e}")
            return 1

    def execute_batch_workflow(self, args: argparse.Namespace) -> int:
        """Execute batch translation workflow"""
        try:
            if not isinstance(self.workflow, BatchTranslationWorkflow):
                self.workflow = BatchTranslationWorkflow(self.config_manager)

            self.logger.info(f"Starting batch translation for: {args.input}")

            results = self.workflow.execute_directory_batch(args.input, recursive=args.recursive)

            # Output batch results
            if args.output_format == "json":
                self._output_json_batch_results(results)
            else:
                self._output_text_batch_results(results)

            successful = sum(1 for r in results if r.success)
            return 0 if successful == len(results) else 1

        except Exception as e:
            self.logger.error(f"Batch workflow execution failed: {e}")
            return 1

    def validate_configuration(self, args: argparse.Namespace) -> int:
        """Validate system configuration"""
        try:
            self.logger.info("Validating configuration...")

            # Test FTP connection
            ftp_client = self.workflow.ftp_manager.get_client()
            if ftp_client:
                self.logger.info("✓ FTP connection successful")
                self.workflow.ftp_manager.close_connection()
            else:
                self.logger.error("✗ FTP connection failed")
                return 1

            # Test translation service
            test_text = "Hello, world!"
            target_lang = self.config_manager.translation_config.target_languages[0]

            result = self.workflow.translation_service.translate_text(test_text, target_lang)

            if result.translated_text and not result.error_message:
                self.logger.info(
                    f"✓ Translation service working (test: '{test_text}' -> '{result.translated_text}')"
                )
            else:
                self.logger.error(f"✗ Translation service failed: {result.error_message}")
                return 1

            self.logger.info("Configuration validation completed successfully")
            return 0

        except Exception as e:
            self.logger.error(f"Configuration validation failed: {e}")
            return 1

    def _output_text_result(self, result) -> None:
        """Output workflow result in text format"""
        print(f"\nWorkflow {result.workflow_id} Results:")
        print(f"  Status: {'SUCCESS' if result.success else 'FAILED'}")
        print(f"  Processing time: {result.processing_time:.2f}s")
        print(f"  Files processed: {result.processed_files}/{result.total_files}")
        print(f"  Success rate: {result.success_rate:.1f}%")
        print(f"  Total translations: {result.total_translations}")
        print(f"  Files uploaded: {result.uploaded_files}")

        if result.error_messages:
            print(f"\nErrors:")
            for error in result.error_messages:
                print(f"  - {error}")

    def _output_json_result(self, result) -> None:
        """Output workflow result in JSON format"""
        output = {
            "workflow_id": result.workflow_id,
            "start_time": result.start_time.isoformat(),
            "end_time": result.end_time.isoformat() if result.end_time else None,
            "success": result.success,
            "processing_time": result.processing_time,
            "total_files": result.total_files,
            "processed_files": result.processed_files,
            "failed_files": result.failed_files,
            "success_rate": result.success_rate,
            "total_translations": result.total_translations,
            "uploaded_files": result.uploaded_files,
            "error_messages": result.error_messages,
        }

        print(json.dumps(output, indent=2))

    def _output_text_batch_results(self, results) -> None:
        """Output batch results in text format"""
        print(f"\nBatch Translation Results:")
        print(f"  Total workflows: {len(results)}")

        successful = sum(1 for r in results if r.success)
        print(f"  Successful: {successful}/{len(results)}")

        total_files = sum(r.total_files for r in results)
        processed_files = sum(r.processed_files for r in results)
        print(f"  Files processed: {processed_files}/{total_files}")

        total_translations = sum(r.total_translations for r in results)
        print(f"  Total translations: {total_translations}")

        print(f"\nWorkflow Details:")
        for result in results:
            status = "SUCCESS" if result.success else "FAILED"
            print(
                f"  {result.workflow_id}: {status} ({result.processed_files}/{result.total_files} files)"
            )

    def _output_json_batch_results(self, results) -> None:
        """Output batch results in JSON format"""
        output = {
            "batch_summary": {
                "total_workflows": len(results),
                "successful_workflows": sum(1 for r in results if r.success),
                "total_files": sum(r.total_files for r in results),
                "processed_files": sum(r.processed_files for r in results),
                "total_translations": sum(r.total_translations for r in results),
            },
            "workflows": [
                {
                    "workflow_id": r.workflow_id,
                    "success": r.success,
                    "processing_time": r.processing_time,
                    "files_processed": f"{r.processed_files}/{r.total_files}",
                    "translations": r.total_translations,
                }
                for r in results
            ],
        }

        print(json.dumps(output, indent=2))


def create_parser() -> argparse.ArgumentParser:
    """Create argument parser"""
    parser = argparse.ArgumentParser(
        description="Multilingual Text Management System - FTP-based Translation Workflow",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Translate files in a directory
  python main.py translate --input ./content --output ./translated
  
  # Batch process multiple directories
  python main.py batch --input ./projects --recursive
  
  # Upload translations to FTP server
  python main.py translate --input ./content --ftp-upload --remote-path translations
  
  # Validate configuration
  python main.py validate
  
  # Use custom configuration file
  python main.py translate --config config.json --input ./content
        """,
    )

    # Global options
    parser.add_argument("--config", "-c", type=str, help="Configuration file path")
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Logging level",
    )
    parser.add_argument("--log-dir", default="logs", help="Log directory")
    parser.add_argument("--log-file", action="store_true", help="Enable file logging")
    parser.add_argument("--json-logs", action="store_true", help="Enable JSON logging")
    parser.add_argument("--quiet", "-q", action="store_true", help="Suppress console output")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument(
        "--output-format",
        choices=["text", "json"],
        default="text",
        help="Output format for results",
    )

    # Subcommands
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Translate command
    translate_parser = subparsers.add_parser("translate", help="Translate files")
    translate_parser.add_argument("--input", "-i", required=True, help="Input directory or file")
    translate_parser.add_argument(
        "--output", "-o", help="Output directory (default: input/translations)"
    )
    translate_parser.add_argument(
        "--patterns", nargs="+", help="File patterns to include (e.g., *.txt *.md)"
    )
    translate_parser.add_argument("--exclude", nargs="+", help="File patterns to exclude")
    translate_parser.add_argument(
        "--ftp-upload", action="store_true", help="Upload translated files to FTP server"
    )
    translate_parser.add_argument(
        "--ftp-download", action="store_true", help="Download files from FTP server first"
    )
    translate_parser.add_argument(
        "--remote-path", default="translations", help="Remote path for FTP uploads"
    )
    translate_parser.add_argument(
        "--backup", action="store_true", default=True, help="Backup original files"
    )
    translate_parser.add_argument(
        "--no-parallel", dest="parallel", action="store_false", help="Disable parallel processing"
    )
    translate_parser.add_argument(
        "--workers", type=int, default=4, help="Number of parallel workers"
    )
    translate_parser.add_argument(
        "--cleanup", action="store_true", default=True, help="Cleanup temporary files"
    )

    # Batch command
    batch_parser = subparsers.add_parser("batch", help="Batch process multiple directories")
    batch_parser.add_argument(
        "--input", "-i", required=True, help="Base directory for batch processing"
    )
    batch_parser.add_argument(
        "--recursive", "-r", action="store_true", help="Process directories recursively"
    )
    batch_parser.add_argument(
        "--output-format",
        choices=["text", "json"],
        default="text",
        help="Output format for results",
    )

    # Validate command
    subparsers.add_parser("validate", help="Validate configuration")

    # Status command
    subparsers.add_parser("status", help="Get current workflow status")

    return parser


def main() -> int:
    """Main entry point"""
    parser = create_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    # Initialize CLI
    cli = TranslationSystemCLI()

    # Setup logging
    cli.setup_logging(args)

    # Load configuration
    cli.load_config(args.config)

    # Create workflow
    batch_mode = args.command == "batch"
    cli.create_workflow(batch_mode)

    # Execute command
    try:
        if args.command == "translate":
            return cli.execute_single_workflow(args)
        elif args.command == "batch":
            return cli.execute_batch_workflow(args)
        elif args.command == "validate":
            return cli.validate_configuration(args)
        elif args.command == "status":
            status = cli.workflow.get_workflow_status()
            if status:
                if args.output_format == "json":
                    print(json.dumps(status, indent=2))
                else:
                    print(f"Workflow {status['workflow_id']} is running...")
                    print(f"  Progress: {status['processed_files']}/{status['total_files']} files")
                    print(f"  Success rate: {status['success_rate']:.1f}%")
                return 0
            else:
                print("No workflow currently running")
                return 1
        else:
            parser.print_help()
            return 1

    except KeyboardInterrupt:
        cli.logger.info("Application interrupted by user")
        return 130
    except Exception as e:
        cli.logger.error(f"Application error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
