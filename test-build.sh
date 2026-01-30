#!/bin/bash
# Script to test the build process locally before deployment

set -e

echo "=========================================="
echo "Testing SolveStack Build Process"
echo "=========================================="

# Clean previous build
echo ""
echo "1. Cleaning previous build..."
rm -rf dist/
echo "✓ Clean successful"

# Install dependencies
echo ""
echo "2. Installing dependencies..."
npm ci
echo "✓ Dependencies installed"

# Run build
echo ""
echo "3. Building project..."
npm run build
touch dist/.nojekyll
echo "✓ Build successful"

# Verify build output
echo ""
echo "4. Verifying build output..."

if [ ! -f "dist/index.html" ]; then
  echo "✗ Error: index.html not found in dist/"
  exit 1
fi
echo "  ✓ index.html found"

if [ ! -f "dist/.nojekyll" ]; then
  echo "✗ Error: .nojekyll not found in dist/"
  exit 1
fi
echo "  ✓ .nojekyll found"

if [ ! -d "dist/assets" ]; then
  echo "✗ Error: assets directory not found in dist/"
  exit 1
fi
echo "  ✓ assets directory found"

# Verify base path
echo ""
echo "5. Verifying base path configuration..."
if ! grep -q "/solvestack/" dist/index.html; then
  echo "✗ Error: base path '/solvestack/' not found in index.html"
  cat dist/index.html
  exit 1
fi
echo "  ✓ Base path configured correctly"

# List build artifacts
echo ""
echo "6. Build artifacts:"
find dist/ -type f -exec echo "  - {}" \;

# Calculate build size
echo ""
echo "7. Build size:"
du -sh dist/
du -sh dist/assets/

# Check for critical files
echo ""
echo "8. Checking critical files..."
css_files=$(find dist/assets -name "*.css" | wc -l)
js_files=$(find dist/assets -name "*.js" | wc -l)

if [ "$css_files" -lt 1 ]; then
  echo "✗ Error: No CSS files found in dist/assets/"
  exit 1
fi
echo "  ✓ Found $css_files CSS file(s)"

if [ "$js_files" -lt 1 ]; then
  echo "✗ Error: No JS files found in dist/assets/"
  exit 1
fi
echo "  ✓ Found $js_files JS file(s)"

echo ""
echo "=========================================="
echo "✓ All tests passed successfully!"
echo "=========================================="
echo ""
echo "To preview the build locally, run:"
echo "  npm run preview"
