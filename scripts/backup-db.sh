#!/bin/bash

# MongoDB Backup Script for Flora
# Run this script regularly to backup your database

set -e

echo "💾 Flora MongoDB Backup Script"
echo "=============================="

# Configuration
BACKUP_DIR="/opt/flora/backups"
DB_NAME="flora_db"
DB_USER="flora_user"
DB_PASSWORD="YOUR_DB_PASSWORD_HERE"  # CHANGE THIS
RETENTION_DAYS=7

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
BACKUP_NAME="flora_backup_$(date +%Y%m%d_%H%M%S)"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "📦 Creating backup: $BACKUP_NAME"

# Create backup
mongodump \
  --uri="mongodb://$DB_USER:$DB_PASSWORD@localhost:27017/$DB_NAME?authSource=$DB_NAME" \
  --out="$BACKUP_PATH"

# Compress backup
echo "🗜️  Compressing backup..."
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_PATH"

# Delete old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "flora_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo ""
echo "✅ Backup completed successfully!"
echo "   Location: $BACKUP_PATH.tar.gz"
echo "   Size: $(du -h "$BACKUP_PATH.tar.gz" | cut -f1)"
echo ""
echo "📋 Available backups:"
ls -lh "$BACKUP_DIR"/*.tar.gz

# To restore a backup, use:
# tar -xzf /opt/flora/backups/flora_backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
# mongorestore --uri="mongodb://flora_user:PASSWORD@localhost:27017/flora_db" /tmp/flora_backup_YYYYMMDD_HHMMSS/flora_db --drop
