#!/bin/bash

# Test script for group creation

echo "Testing group creation..."

# Test 1: Create a group (this will fail due to authentication, but we can see the response)
echo "Test 1: Creating a group"
curl -X POST http://localhost:8080/api/groups \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Test Group&description=This is a test group for testing purposes" \
  -v

echo -e "\n\n"

# Test 2: Get groups (this will also fail due to authentication)
echo "Test 2: Getting groups"
curl -X GET http://localhost:8080/api/groups \
  -v

echo -e "\n\nDone!"
