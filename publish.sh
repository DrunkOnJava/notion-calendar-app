#!/bin/bash
# Script to push local repository to GitHub

echo "🚀 Publishing to GitHub..."

# Add remote if it doesn't exist
if ! git remote | grep -q "origin"; then
    echo "📡 Adding GitHub remote..."
    git remote add origin https://github.com/DrunkOnJava/notion-calendar.git
else
    echo "✓ Remote already exists"
fi

# Ensure we're on main branch
echo "🌿 Checking branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully published to https://github.com/DrunkOnJava/notion-calendar"
