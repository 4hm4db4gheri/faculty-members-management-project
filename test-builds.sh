#!/bin/bash

echo "Testing different Docker build approaches..."

echo "1. Testing main Dockerfile.prod (Node 18 + Nginx Alpine)..."
docker build -f Dockerfile.prod -t faculty-dashboard:main . || echo "Main build failed"

echo "2. Testing stable version (Explicit versions)..."
docker build -f Dockerfile.prod.stable -t faculty-dashboard:stable . || echo "Stable build failed"

echo "3. Testing Ubuntu-based version..."
docker build -f Dockerfile.prod.ubuntu -t faculty-dashboard:ubuntu . || echo "Ubuntu build failed"

echo "Build test completed!"
