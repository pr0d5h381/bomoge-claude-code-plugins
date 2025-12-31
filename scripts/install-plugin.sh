#!/bin/bash
# Install a plugin from this marketplace to ~/.claude/plugins/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKETPLACE_DIR="$(dirname "$SCRIPT_DIR")"
PLUGINS_DIR="$MARKETPLACE_DIR/plugins"
CLAUDE_PLUGINS_DIR="$HOME/.claude/plugins"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 <plugin-name>"
    echo ""
    echo "Available plugins:"
    for plugin in "$PLUGINS_DIR"/*/; do
        if [ -d "$plugin" ]; then
            plugin_name=$(basename "$plugin")
            echo "  - $plugin_name"
        fi
    done
    exit 1
}

if [ -z "$1" ]; then
    usage
fi

PLUGIN_NAME="$1"
PLUGIN_PATH="$PLUGINS_DIR/$PLUGIN_NAME"

if [ ! -d "$PLUGIN_PATH" ]; then
    echo -e "${RED}Error: Plugin '$PLUGIN_NAME' not found${NC}"
    echo ""
    usage
fi

# Create Claude plugins directory if it doesn't exist
mkdir -p "$CLAUDE_PLUGINS_DIR"

# Check if plugin already exists
if [ -e "$CLAUDE_PLUGINS_DIR/$PLUGIN_NAME" ]; then
    echo -e "${YELLOW}Plugin '$PLUGIN_NAME' already exists. Removing old version...${NC}"
    rm -rf "$CLAUDE_PLUGINS_DIR/$PLUGIN_NAME"
fi

# Create symlink
ln -s "$PLUGIN_PATH" "$CLAUDE_PLUGINS_DIR/$PLUGIN_NAME"

echo -e "${GREEN}✓ Plugin '$PLUGIN_NAME' installed successfully!${NC}"
echo ""
echo "Location: $CLAUDE_PLUGINS_DIR/$PLUGIN_NAME -> $PLUGIN_PATH"
echo ""
echo "Restart Claude Code to load the plugin."
