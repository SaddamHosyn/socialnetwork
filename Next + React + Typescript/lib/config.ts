// Configuration for backend API URL
// In Docker containers, use the service name "backend"
// In development, use localhost
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
