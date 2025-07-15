# real-time-forum

# Docker Deployment Guide

This project includes a multi-stage Dockerfile for efficient containerization of both the Go backend and Next.js frontend.

## Quick Start

### Option 1: Using the build script (Recommended)

```bash
./build-and-run.sh
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t social-network:latest .

# Run the container
docker run -d \
  --name social-network \
  -p 8080:8080 \
  -v "$(pwd)/data/database:/app/database" \
  -v "$(pwd)/data/uploads:/app/uploads" \
  --restart unless-stopped \
  social-network:latest
```

### Option 3: Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f
```

## Docker Architecture

The Dockerfile uses a 2-stage build process:

### Stage 1: Build Stage

- **Frontend Builder**: Uses Node.js 20 Alpine to build the Next.js frontend
- **Backend Builder**: Uses Go 1.23 Alpine to build the Go backend with CGO support for SQLite

### Stage 2: Production Stage

- Uses minimal Alpine Linux base image
- Copies built binaries and assets from build stages
- Creates non-root user for security
- Includes health checks

## Docker Features

- **Multi-stage build**: Optimized for smaller final image size
- **Security**: Runs as non-root user
- **Health checks**: Built-in health monitoring
- **Volume persistence**: Database and uploads persist between container restarts
- **Auto-restart**: Container restarts automatically if it crashes

## Environment Variables

You can customize the container behavior using environment variables:

```bash
docker run -d \
  --name social-network \
  -p 8080:8080 \
  -e ENV=production \
  -v "$(pwd)/data/database:/app/database" \
  -v "$(pwd)/data/uploads:/app/uploads" \
  social-network:latest
```

## Volumes

- `/app/database`: SQLite database files
- `/app/uploads`: User uploaded files (avatars, post images)

## Ports

- `8080`: Main application port (HTTP)

## Management Commands

```bash
# View container logs
docker logs social-network

# View real-time logs
docker logs -f social-network

# Stop container
docker stop social-network

# Start stopped container
docker start social-network

# Remove container
docker rm social-network

# Remove image
docker rmi social-network:latest

# Access container shell
docker exec -it social-network sh
```

## Production Considerations

1. **Reverse Proxy**: Consider using nginx or Traefik for SSL termination
2. **Database Backups**: Regularly backup the SQLite database
3. **Monitoring**: Implement proper monitoring and logging
4. **Security**: Keep base images updated
5. **Resource Limits**: Set appropriate memory and CPU limits

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs social-network

# Check if port is available
netstat -an | grep 8080
```

### Database issues

```bash
# Check database permissions
docker exec -it social-network ls -la /app/database/

# Reset database (WARNING: This will delete all data)
docker exec -it social-network rm -f /app/database/forum.db*
docker restart social-network
```

### Build issues

```bash
# Clean build (no cache)
docker build --no-cache -t social-network:latest .

# Check build logs
docker build -t social-network:latest . 2>&1 | tee build.log
```
