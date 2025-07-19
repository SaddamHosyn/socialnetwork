# Backend Dockerfile with Ubuntu to avoid Alpine networking issues
FROM golang:1.23 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y gcc sqlite3 libsqlite3-dev

# Set working directory
WORKDIR /app

# Copy entire project structure
COPY . .

# Build the application from backend directory with CGO enabled for SQLite
WORKDIR /app/backend
RUN CGO_ENABLED=1 GOOS=linux go build -a -o main main.go

# Production stage
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && apt-get install -y sqlite3 ca-certificates tzdata wget

# Create non-root user
RUN useradd -m -s /bin/bash appuser

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/backend/main .

# Copy pkg directory with migrations and other resources
COPY --from=builder /app/backend/pkg ./pkg

# Create necessary directories
RUN mkdir -p database uploads uploads/avatars

# Copy database files if they exist
COPY backend/database/ ./database/

# Set ownership
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/heartbeat || exit 1

# Start the application
CMD ["./main"]
