#!/bin/bash

echo "Radiant: Check Node version"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly APPLICATION_FOLDER="$SCRIPT_DIR/../../apps"
readonly MIN_NODE_VERSION="26.12.1"

installed_node_version=$(node -v 2>/dev/null | sed 's/^v//')

if [ -z "$installed_node_version" ]; then
  echo "ⓧ Node.js is not installed or not in PATH."
  exit 1
fi

ver_check=$(printf "%s\n%s\n" "$MIN_NODE_VERSION" "$installed_node_version" | sort -V | head -n1)

if [ "$ver_check" != "$MIN_NODE_VERSION" ]; then
  echo "ⓧ Node.js version $installed_node_version is lower than required $MIN_NODE_VERSION."
  exit 1
fi

echo "✅ Node.js version $installed_node_version meets the requirement."
echo ""

echo "Radiant: Create a new page application"
read -p "Page application name (use kebab-case e.g. case-exploration): " app_name

if [ -z "$app_name" ]; then
  echo "ⓧ App name cannot be empty."
  exit 1
fi

if [[ "$app_name" =~ \  ]]; then
  echo "ⓧ App name cannot contain spaces."
  exit 1
fi

TEMPLATE_DIR="$SCRIPT_DIR/template"
TARGET_DIR="$APPLICATION_FOLDER/$app_name"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ⓧ Error: Template folder not found at $TEMPLATE_DIR."
  exit 1
fi

if [ -d "$TARGET_DIR" ]; then
  echo "ⓧ Error: Folder '$TARGET_DIR' already exists."
  exit 1
fi

echo "📁 Copying template files..."
mkdir -p "$TARGET_DIR"
cp -rv "$TEMPLATE_DIR"/. "$TARGET_DIR"

echo ""
echo "📄 Files copied to '$TARGET_DIR':"
find "$TARGET_DIR" -type f | while read -r file; do
  echo "→ $file"
done

echo ""
echo "🔧 Replacing %name% with '$app_name' in matching files..."

find "$TARGET_DIR" -type f | while read -r file; do
  if grep -q '%name%' "$file"; then
    echo "✏️  Modified: $file"
    perl -i -pe "s/\Q%name%\E/$app_name/g" "$file"
  fi
done

echo ""
echo "✅ Page Application '$app_name' created successfully."
echo "   Run 'npm install' from frontend/ to hoist its dependencies into the workspace."
echo "   Register it: catalog + bundle + routes.module + portal tsconfig path alias."
