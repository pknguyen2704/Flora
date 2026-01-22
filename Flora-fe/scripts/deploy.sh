#!/bin/bash

# Flora Frontend Deployment Script  
# This script builds and deploys the frontend

set -e  # Exit on any error

echo "🎨 Flora Frontend Deployment Script"
echo "===================================="

# Configuration
FRONTEND_DIR="/opt/flora/Flora-fe"
DEPLOY_DIR="/var/www/flora/dist"
BACKUP_DIR="/var/www/flora/dist-backup"

# Check if running as flora user
if [ "$USER" != "flora" ]; then
    echo "❌ This script must be run as the flora user"
    echo "   Run: su - flora"
    exit 1
fi

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Pull latest code
echo "📥 Pulling latest code from repository..."
git pull origin main

# Install/update dependencies
echo "📦 Installing/updating npm dependencies..."
npm install

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production not found, creating from example..."
    cat > .env.production << EOF
VITE_API_BASE_URL=https://flora.io.vn/api/v1
EOF
fi

# Build production bundle
echo "🔨 Building production bundle..."
npm run build

# Backup current deployment
if [ -d "$DEPLOY_DIR" ]; then
    echo "💾 Backing up current deployment..."
    sudo rm -rf "$BACKUP_DIR"
    sudo mv "$DEPLOY_DIR" "$BACKUP_DIR"
fi

# Deploy new build
echo "🚀 Deploying new build..."
sudo mkdir -p "$DEPLOY_DIR"
sudo cp -r dist/* "$DEPLOY_DIR/"
sudo chown -R www-data:www-data "$DEPLOY_DIR"

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
sudo nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Frontend deployed successfully!"
echo "   Website: https://flora.io.vn"
echo "   Backup available at: $BACKUP_DIR"
echo ""
echo "💡 To rollback: sudo mv $BACKUP_DIR $DEPLOY_DIR && sudo systemctl reload nginx"
