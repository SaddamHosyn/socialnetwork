#!/bin/bash

echo "Testing Social Network API Endpoints..."

# Test if backend is running
echo "1. Testing backend availability..."
curl -s "http://localhost:8080/api/categories" | head -n 1
echo ""

# Test if frontend is running
echo "2. Testing frontend availability..."
curl -s "http://localhost:3001/api/me" | head -n 1
echo ""

# Test if avatar files are accessible
echo "3. Testing avatar accessibility..."
curl -s "http://localhost:8080/uploads/avatars/default_avatar.svg" | head -n 1
echo ""

# Test follow API routes (should fail without auth but show they exist)
echo "4. Testing follow API routes..."
echo "Follow status:"
curl -s "http://localhost:3001/api/follow/status?user_id=1" | head -n 1
echo ""

echo "Follow requests:"
curl -s "http://localhost:3001/api/follow/requests" | head -n 1
echo ""

echo "5. Testing favicon..."
curl -s "http://localhost:3001/favicon.ico" | head -n 1
echo ""

echo "Test complete!"
