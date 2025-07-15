#!/bin/bash

# Build and run script for Social Network Docker container

set -e

echo "🐳 Building Social Network Docker container..."

# Build the Docker image
docker build -t social-network:latest .

echo "✅ Build completed successfully!"

# Ask user if they want to run the container
read -p "Do you want to run the container now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting Social Network container..."
    
    # Create data directories if they don't exist
    mkdir -p data/database data/uploads/avatars
    
    # Run the container
    docker run -d \
        --name social-network \
        -p 8080:8080 \
        -v "$(pwd)/data/database:/app/database" \
        -v "$(pwd)/data/uploads:/app/uploads" \
        --restart unless-stopped \
        social-network:latest
    
    echo "✅ Container started successfully!"
    echo "🌐 Application is available at: http://localhost:8080"
    echo "📊 Check container logs: docker logs social-network"
    echo "🛑 Stop container: docker stop social-network"
    echo "🗑️  Remove container: docker rm social-network"
else
    echo "💡 To run the container later, use:"
    echo "   docker run -d --name social-network -p 8080:8080 social-network:latest"
fi

echo "🎉 Done!"
