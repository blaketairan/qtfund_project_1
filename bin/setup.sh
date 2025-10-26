#!/bin/bash

echo "Setting up QTFund Frontend environment..."

if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed"
    echo "Please install npm or reinstall Node.js"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    echo "Please ensure you are in the project root directory"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "Found Node.js $NODE_VERSION and npm $NPM_VERSION"

if [ -d "node_modules" ]; then
    echo "Dependencies already installed, running npm ci..."
    npm ci
else
    echo "Installing dependencies..."
    npm install
fi

if [ $? -eq 0 ]; then
    echo "✓ Environment setup complete!"
    echo "You can now run: ./bin/start.sh"
else
    echo "✗ Setup failed. Please check the error messages above."
    exit 1
fi

