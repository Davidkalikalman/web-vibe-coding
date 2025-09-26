# Deployment Guide

This guide covers deployment options for the Multilingual Text Management System in various environments.

## 📋 Prerequisites

### System Requirements
- **Python**: 3.8+ (for local deployment)
- **Docker**: 20.10+ (for containerized deployment)
- **Docker Compose**: 1.29+ (for orchestrated deployment)
- **Memory**: 512MB minimum, 2GB recommended
- **Storage**: 1GB minimum for application and logs
- **Network**: Internet access for translation services

### Required Services
- **FTP/SFTP Server**: For file transfer operations
- **Translation API**: Google Translate (free), DeepL, or OpenAI (API keys required)

## 🚀 Deployment Options

### 1. Local Development Deployment

#### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd translation-system

# Run setup script
./scripts/setup.sh

# Configure environment
cp env.example .env
# Edit .env with your settings

# Activate virtual environment
source venv/bin/activate

# Run application
python src/main.py translate --input input --output output
```

#### Manual Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create directories
mkdir -p {input,output,logs,cache}

# Configure environment
cp env.example .env
nano .env  # Edit configuration

# Validate setup
python src/main.py validate

# Run translation
python src/main.py translate --input input --output output
```

### 2. Docker Development Deployment

#### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --profile development up -d

# Connect to development container
docker exec -it translation-dev bash

# Run application inside container
python src/main.py translate --input /app/input --output /app/output
```

#### With FTP Test Server
```bash
# Start with test FTP server
docker-compose -f docker-compose.dev.yml --profile development --profile ftp up -d

# Configure to use test FTP server
echo "FTP_HOST=ftp-server" >> .env
echo "FTP_USERNAME=testuser" >> .env
echo "FTP_PASSWORD=testpass" >> .env
```

### 3. Production Docker Deployment

#### Single Container
```bash
# Configure environment
cp env.example .env
# Edit .env with production settings

# Build and start
docker-compose up -d

# Monitor logs
docker-compose logs -f translation-system

# Check health
docker-compose exec translation-system python src/main.py validate
```

#### Production Configuration
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  translation-system:
    build:
      context: .
      target: production
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=INFO
    volumes:
      - /data/translation/input:/app/input:ro
      - /data/translation/output:/app/output
      - /data/translation/logs:/app/logs
      - /data/translation/cache:/app/cache
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

### 4. Kubernetes Deployment

#### Basic Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: translation-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app: translation-system
  template:
    metadata:
      labels:
        app: translation-system
    spec:
      containers:
      - name: translation-system
        image: translation-system:latest
        env:
        - name: FTP_HOST
          valueFrom:
            secretKeyRef:
              name: translation-secrets
              key: ftp-host
        - name: FTP_USERNAME
          valueFrom:
            secretKeyRef:
              name: translation-secrets
              key: ftp-username
        - name: FTP_PASSWORD
          valueFrom:
            secretKeyRef:
              name: translation-secrets
              key: ftp-password
        - name: TRANSLATION_API_KEY
          valueFrom:
            secretKeyRef:
              name: translation-secrets
              key: api-key
        volumeMounts:
        - name: input-volume
          mountPath: /app/input
        - name: output-volume
          mountPath: /app/output
        - name: logs-volume
          mountPath: /app/logs
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
      volumes:
      - name: input-volume
        persistentVolumeClaim:
          claimName: translation-input-pvc
      - name: output-volume
        persistentVolumeClaim:
          claimName: translation-output-pvc
      - name: logs-volume
        persistentVolumeClaim:
          claimName: translation-logs-pvc
```

#### Secrets Configuration
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: translation-secrets
type: Opaque
data:
  ftp-host: <base64-encoded-ftp-host>
  ftp-username: <base64-encoded-username>
  ftp-password: <base64-encoded-password>
  api-key: <base64-encoded-api-key>
```

#### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: translation-config
data:
  config.json: |
    {
      "translation": {
        "service": "google",
        "source_language": "en",
        "target_languages": ["sk", "hu", "de", "pl"]
      },
      "processing": {
        "parallel_workers": 4,
        "batch_size": 10
      }
    }
```

## 🔧 Configuration Management

### Environment Variables

#### Required Settings
```env
# FTP Configuration
FTP_HOST=your-ftp-server.com
FTP_USERNAME=your-username
FTP_PASSWORD=your-password

# Translation Service
TRANSLATION_SERVICE=google
TRANSLATION_API_KEY=your-api-key
```

#### Production Settings
```env
# Logging
LOG_LEVEL=INFO
ENABLE_JSON_LOG=true

# Performance
PARALLEL_WORKERS=4
MAX_FILE_SIZE=10485760

# Security
FTP_USE_TLS=true
SSL_VERIFY=true
```

### Configuration Files

#### Production Config
```json
{
  "ftp": {
    "use_tls": true,
    "passive_mode": true,
    "timeout": 30
  },
  "translation": {
    "service": "google",
    "max_retries": 3,
    "cache_enabled": true
  },
  "processing": {
    "parallel_workers": 4,
    "backup_original": true
  },
  "logging": {
    "level": "INFO",
    "enable_file": true,
    "enable_json": true
  }
}
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint
```bash
# Manual health check
docker exec translation-system python src/main.py validate

# Automated health check (Docker)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python src/main.py validate || exit 1
```

### Log Monitoring
```bash
# Real-time logs
docker-compose logs -f translation-system

# JSON log analysis
docker exec translation-system cat /app/logs/translation_system.json | jq

# Performance metrics
docker exec translation-system grep "performance_metric" /app/logs/translation_system.json
```

### Metrics Collection
```bash
# Workflow statistics
curl -s localhost:8080/metrics | grep translation_

# System resources
docker stats translation-system

# Log metrics
cat logs/translation_system.json | jq '.metric_name, .metric_value' | grep -v null
```

## 🔒 Security Considerations

### Secrets Management
```bash
# Docker secrets
echo "your-ftp-password" | docker secret create ftp_password -

# Kubernetes secrets
kubectl create secret generic translation-secrets \
  --from-literal=ftp-password=your-password \
  --from-literal=api-key=your-api-key
```

### Network Security
```yaml
# Docker network isolation
networks:
  translation-network:
    driver: bridge
    internal: true
```

### File Permissions
```bash
# Secure file permissions
chmod 600 .env
chmod 600 config/production.json
chmod 755 scripts/*.sh
```

## 🔄 Backup and Recovery

### Data Backup
```bash
# Backup configuration
tar -czf backup-$(date +%Y%m%d).tar.gz config/ .env

# Backup output data
rsync -av output/ backup/output/

# Backup logs
rsync -av logs/ backup/logs/
```

### Disaster Recovery
```bash
# Restore configuration
tar -xzf backup-20231201.tar.gz

# Restore data
rsync -av backup/output/ output/

# Restart services
docker-compose down && docker-compose up -d
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale containers
docker-compose up --scale translation-system=3

# Kubernetes scaling
kubectl scale deployment translation-system --replicas=5
```

### Vertical Scaling
```yaml
# Increase resources
resources:
  limits:
    memory: "4Gi"
    cpu: "2000m"
```

### Load Balancing
```yaml
# Kubernetes service
apiVersion: v1
kind: Service
metadata:
  name: translation-service
spec:
  selector:
    app: translation-system
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker logs translation-system

# Check configuration
docker exec translation-system python src/main.py validate

# Check file permissions
ls -la config/ logs/
```

#### FTP Connection Issues
```bash
# Test FTP connection
docker exec translation-system python -c "
from src.services.ftp_client import SecureFTPClient
from src.core.config_manager import ConfigManager
config = ConfigManager()
client = SecureFTPClient(config.ftp_config)
print('Connection:', client.connect())
"
```

#### Translation Failures
```bash
# Check API configuration
docker exec translation-system python -c "
from src.services.translation_service import TranslationService
from src.core.config_manager import ConfigManager
config = ConfigManager()
service = TranslationService(config)
result = service.translate_text('test', 'sk')
print('Result:', result.translated_text)
"
```

### Performance Issues
```bash
# Monitor resource usage
docker stats translation-system

# Check log files
tail -f logs/translation_system.log | grep ERROR

# Reduce parallel workers
export PARALLEL_WORKERS=2
docker-compose restart
```

## 📝 Maintenance

### Regular Maintenance Tasks
```bash
# Log rotation
find logs/ -name "*.log" -mtime +30 -delete

# Cache cleanup
find cache/ -name "*.cache" -mtime +7 -delete

# Update dependencies
pip install --upgrade -r requirements.txt

# Security updates
docker pull python:3.12-slim
docker-compose build --no-cache
```

### Monitoring Scripts
```bash
#!/bin/bash
# Daily health check
python src/main.py validate >> logs/health-check.log 2>&1

# Weekly backup
tar -czf backups/backup-$(date +%Y%m%d).tar.gz config/ logs/

# Monthly cleanup
find logs/ -name "*.log" -mtime +30 -delete
find cache/ -name "*" -mtime +30 -delete
```

## 🎯 Best Practices

### Production Deployment
1. Use specific image tags, not `latest`
2. Set resource limits and requests
3. Configure proper health checks
4. Use secrets for sensitive data
5. Enable log rotation
6. Monitor resource usage
7. Regular security updates
8. Backup configuration and data

### Performance Optimization
1. Tune parallel workers based on CPU cores
2. Optimize batch sizes for memory usage
3. Use translation caching
4. Monitor and limit file sizes
5. Use efficient file formats
6. Enable compression for FTP transfers

### Security Hardening
1. Use TLS for all connections
2. Rotate credentials regularly
3. Limit network access
4. Use read-only volumes where possible
5. Run as non-root user
6. Enable audit logging
7. Regular vulnerability scans
