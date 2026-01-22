#!/bin/bash

# Flora Backend Deployment Script
# This script automates backend deployment on Ubuntu server

set -e  # Exit on any error

echo "🚀 Flora Backend Deployment Script"
echo "===================================="

# Configuration
APP_DIR="/opt/flora/Flora-be"
VENV_DIR="$APP_DIR/venv"
SERVICE_NAME="flora-backend"

# Check if running as flora user
if [ "$USER" != "flora" ]; then
    echo "❌ This script must be run as the flora user"
    echo "   Run: su - flora"
    exit 1
fi

# Navigate to backend directory
cd "$APP_DIR"

# Pull latest code
echo "📥 Pulling latest code from repository..."
git pull origin main

# Activate virtual environment
echo "🐍 Activating Python virtual environment..."
source "$VENV_DIR/bin/activate"

# Update dependencies
echo "📦 Installing/updating Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations if any
# echo "🗄️ Running database migrations..."
# python scripts/migrate.py

# Check configuration
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Please create .env file from .env.example"
    exit 1
fi

# Restart backend service
echo "🔄 Restarting backend service..."
sudo systemctl restart "$SERVICE_NAME"

# Wait for service to start
sleep 3

# Check service status
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "✅ Backend deployed successfully!"
    echo "   Service status:"
    sudo systemctl status "$SERVICE_NAME" --no-pager -l
else
    echo "❌ Backend service failed to start"
    echo "   Check logs: sudo journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo "   View logs: sudo journalctl -u $SERVICE_NAME -f"
