#!/bin/bash

# Development Setup and Run Script for Social Network Project
# This script helps you run the project in development mode

set -e

echo "🚀 Social Network - Development Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "🔍 Checking requirements..."
    
    # Check Go
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go 1.23 or later."
        echo "Install from: https://golang.org/dl/"
        exit 1
    fi
    print_status "Go found: $(go version)"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20 or later."
        echo "Install from: https://nodejs.org/"
        exit 1
    fi
    print_status "Node.js found: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_status "npm found: $(npm --version)"
}

# Setup backend
setup_backend() {
    echo ""
    echo "🔧 Setting up Go backend..."
    
    # Download Go dependencies
    print_status "Downloading Go dependencies..."
    go mod download
    go mod tidy
    
    # Create necessary directories
    mkdir -p backend/database
    mkdir -p backend/uploads/avatars
    
    print_status "Backend setup complete"
}

# Setup frontend
setup_frontend() {
    echo ""
    echo "🔧 Setting up Next.js frontend..."
    
    cd "Next + React + Typescript"
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    cd ..
    print_status "Frontend setup complete"
}

# Build frontend for production
build_frontend() {
    echo ""
    echo "🏗️  Building frontend..."
    
    cd "Next + React + Typescript"
    npm run build
    cd ..
    
    print_status "Frontend build complete"
}

# Run development mode
run_development() {
    echo ""
    echo "🚀 Starting development servers..."
    
    # Kill any existing processes on ports 8080 and 3000
    pkill -f "main" || true
    pkill -f "next dev" || true
    
    print_status "Starting Go backend on port 8080..."
    cd backend
    go run main.go &
    BACKEND_PID=$!
    cd ..
    
    sleep 2
    
    print_status "Starting Next.js frontend on port 3000..."
    cd "Next + React + Typescript"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    print_status "Development servers started!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:8080"
    echo "📊 API:      http://localhost:8080/api"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Wait for interrupt signal
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
}

# Run production mode
run_production() {
    echo ""
    echo "🏭 Starting production mode..."
    
    # Build frontend first
    build_frontend
    
    # Build and run backend
    print_status "Building and starting Go backend..."
    cd backend
    go build -o social-network main.go
    ./social-network &
    BACKEND_PID=$!
    cd ..
    
    echo ""
    print_status "Production server started!"
    echo "🌐 Application: http://localhost:8080"
    echo "📊 API:         http://localhost:8080/api"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    # Wait for interrupt signal
    trap 'kill $BACKEND_PID; exit' INT
    wait
}

# Main menu
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1. Setup project (first time)"
    echo "2. Run development mode (Go backend + Next.js dev server)"
    echo "3. Run production mode (Go backend + built Next.js)"
    echo "4. Build frontend only"
    echo "5. Setup backend only"
    echo "6. Setup frontend only"
    echo "7. Exit"
    echo ""
}

# Main execution
main() {
    # Check requirements first
    check_requirements
    
    # If arguments provided, run directly
    case "${1:-}" in
        "setup"|"install")
            setup_backend
            setup_frontend
            print_status "Project setup complete!"
            ;;
        "dev"|"development")
            run_development
            ;;
        "prod"|"production")
            run_production
            ;;
        "build")
            build_frontend
            ;;
        *)
            # Interactive mode
            while true; do
                show_menu
                read -p "Enter your choice (1-7): " choice
                
                case $choice in
                    1)
                        setup_backend
                        setup_frontend
                        print_status "Project setup complete!"
                        ;;
                    2)
                        run_development
                        ;;
                    3)
                        run_production
                        ;;
                    4)
                        build_frontend
                        ;;
                    5)
                        setup_backend
                        ;;
                    6)
                        setup_frontend
                        ;;
                    7)
                        print_status "Goodbye!"
                        exit 0
                        ;;
                    *)
                        print_error "Invalid option. Please choose 1-7."
                        ;;
                esac
                
                echo ""
                read -p "Press Enter to continue..."
            done
            ;;
    esac
}

# Run main function
main "$@"
