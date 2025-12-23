#!/bin/bash

# Script to initialize and update all git submodules
# Run this after cloning the repository

set -e  # Exit on any error

echo "Initializing and updating git submodules..."
echo "This will clone all 17 AlgoKit repositories as submodules."
echo ""

# Initialize and update all submodules
git submodule update --init --recursive

echo ""
echo "✓ Successfully initialized all submodules!"
echo ""
echo "The following repositories are now available:"
echo "  - algokit-avm-debugger (main)"
echo "  - algokit-avm-vscode-debugger (main)"
echo "  - algokit-cli (main)"
echo "  - algokit-client-generator-py (main)"
echo "  - algokit-client-generator-ts (main)"
echo "  - algokit-dispenser-api (main)"
echo "  - algokit-example-gallery (main)"
echo "  - algokit-lora (main)"
echo "  - algokit-subscriber-py (main)"
echo "  - algokit-subscriber-ts (main)"
echo "  - algokit-utils-py (alpha branch)"
echo "  - algokit-utils-ts (decoupling branch)"
echo "  - algokit-utils-ts-debug (main)"
echo "  - algorand-python-testing (main)"
echo "  - algorand-typescript-testing (main)"
echo "  - puya (main)"
echo "  - puya-ts (main)"
echo ""
echo "You're ready to run the consistency analysis!"
