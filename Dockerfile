# Stage 1: Build stage
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY "Next + React + Typescript/package*.json" ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY "Next + React + Typescript/" ./

# Build the frontend
RUN npm run build

# Stage 1.5: Go build stage
FROM golang:1.23-alpine AS backend-builder

# Install required packages for CGO (SQLite)
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Set working directory
WORKDIR /app

# Copy go module files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source code
COPY backend/ ./backend/

# Build the Go application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main ./backend/main.go

# Stage 2: Production stage
FROM alpine:latest

# Install sqlite and ca-certificates for HTTPS
RUN apk --no-cache add sqlite ca-certificates tzdata

# Create non-root user
RUN adduser -D -s /bin/sh appuser

# Set working directory
WORKDIR /app

# Copy the built Go binary from builder stage
COPY --from=backend-builder /app/main .

# Copy the built frontend from builder stage
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/package.json ./package.json

# Create necessary directories
RUN mkdir -p database uploads uploads/avatars

# Copy any existing database migrations or initial data
COPY backend/database/ ./database/

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/heartbeat || exit 1

# Start the application
CMD ["./main"]
