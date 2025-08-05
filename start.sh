#!/bin/bash

echo "🚀 Starting Competitor Monitor SaaS..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Copying from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your Meta API credentials."
    echo ""
    echo "Required: Add your META_APP_ID and META_APP_SECRET to .env file"
    echo "Get them from: https://developers.facebook.com"
    echo ""
    echo "After editing .env, run this script again."
    exit 1
fi

echo "🐳 Starting Docker containers..."
echo ""

# Start the application
docker-compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Application should be running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   Database: http://localhost:8080 (pgAdmin)"
echo ""
echo "Press Ctrl+C to stop all services."