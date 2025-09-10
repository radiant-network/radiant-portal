#!/bin/bash

echo "Radiant: Check Node version"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly APPLICATION_FOLDER="$SCRIPT_DIR/../../apps"
readonly MIN_NODE_VERSION="20.18.0"

# Get installed Node.js version
installed_node_version=$(node -v 2>/dev/null | sed 's/^v//')

if [ -z "$installed_node_version" ]; then
  echo "ⓧ Node.js is not installed or not in PATH."
  exit 1
fi

# Compare versions
ver_check=$(printf "%s\n%s\n" "$MIN_NODE_VERSION" "$installed_node_version" | sort -V | head -n1)

if [ "$ver_check" != "$MIN_NODE_VERSION" ]; then
  echo "ⓧ Node.js version $installed_node_version is lower than required $MIN_NODE_VERSION."
  exit 1
fi

echo "✅ Node.js version $installed_node_version meets the requirement."
echo ""

echo "Radiant: Create a new page application"
read -p "Page application name (use kebab-case e.g. case-exploration): " app_name

# Input validation
if [ -z "$app_name" ]; then
  echo "ⓧ App name cannot be empty."
  exit 1
fi

if [[ "$app_name" =~ \  ]]; then
  echo "ⓧ App name cannot contain spaces."
  exit 1
fi

TEMPLATE_DIR="$(dirname "$0")/template"
TARGET_DIR="$APPLICATION_FOLDER/$app_name"

# Check if the template folder exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ⓧ Error: Template folder not found at $TEMPLATE_DIR."
  exit 1
fi

# Check if destination already exists
if [ -d "$TARGET_DIR" ]; then
  echo "ⓧ Error: Folder '$TARGET_DIR' already exists."
  exit 1
fi

# Copy template
echo "📁 Copying template files..."
mkdir -p "$TARGET_DIR"
cp -rv "$TEMPLATE_DIR"/. "$TARGET_DIR"

# List copied files
echo ""
echo "📄 Files copied to '$TARGET_DIR':"
find "$TARGET_DIR" -type f | while read -r file; do
  echo "→ $file"
done


cd "$TARGET_DIR"

# Replace %name% placeholders
echo ""
echo "🔧 Replacing %name% with '$app_name' in matching files..."

find "$TARGET_DIR" -type f | while read -r file; do
  if grep -q '%name%' "$file"; then
    echo "✏️  Modified: $file"
    sed -i "s/%name%/$app_name/g" "$file"
  fi
done

# Install dependencies
echo ""
echo "📦 Installing dependencies in '$app_name'..."
npm install

echo ""
echo "✅ Page Application '$app_name' created successfully!"
