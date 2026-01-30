#!/bin/bash
# Simulates the GitHub Actions workflow locally

set -e

echo "=========================================="
echo "Simulating GitHub Actions Workflow"
echo "=========================================="

# Job 1: Build
echo ""
echo "==== JOB 1: BUILD ===="
echo ""

echo "Step: Checkout repository (simulated)"
echo "✓ Repository already checked out"

echo ""
echo "Step: Setup Node.js"
node --version
npm --version
echo "✓ Node.js ready"

echo ""
echo "Step: Install dependencies"
rm -rf node_modules dist
npm ci
echo "✓ Dependencies installed"

echo ""
echo "Step: Build project"
npm run build
echo "✓ Build completed"

echo ""
echo "Step: Add .nojekyll file"
touch dist/.nojekyll
echo "✓ .nojekyll file added"

echo ""
echo "Step: Upload build artifacts (simulated)"
echo "✓ Artifacts would be uploaded"

# Job 2: Test Build
echo ""
echo "==== JOB 2: TEST BUILD ===="
echo ""

echo "Step: Download build artifacts (simulated)"
echo "✓ Using local dist/ directory"

echo ""
echo "Step: Verify build output"
ls -la dist/

if [ ! -f "dist/index.html" ]; then
  echo "✗ Error: index.html not found in dist/"
  exit 1
fi

if [ ! -f "dist/.nojekyll" ]; then
  echo "✗ Error: .nojekyll not found in dist/"
  exit 1
fi

if [ ! -d "dist/assets" ]; then
  echo "✗ Error: assets directory not found in dist/"
  exit 1
fi

echo "Build verification successful!"
echo "Build contains:"
find dist/ -type f -exec echo "  {}" \;

echo ""
echo "Step: Test build content"
if ! grep -q "/solvestack/" dist/index.html; then
  echo "✗ Error: base path '/solvestack/' not found in index.html"
  cat dist/index.html
  exit 1
fi
echo "✓ Base path verification successful!"

# Job 3: Deploy
echo ""
echo "==== JOB 3: DEPLOY ===="
echo ""

echo "Step: Download build artifacts (simulated)"
echo "✓ Using local dist/ directory"

echo ""
echo "Step: Deploy to gh-pages branch (simulated)"
echo "✓ Would deploy the following files to gh-pages:"
find dist/ -type f -exec echo "  - {}" \;

# Summary
echo ""
echo "=========================================="
echo "✓ WORKFLOW SIMULATION SUCCESSFUL"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Build completed successfully"
echo "  - All validation checks passed"
echo "  - Ready for deployment"
echo ""
echo "Next steps:"
echo "  1. Push changes to main branch"
echo "  2. GitHub Actions will automatically run this workflow"
echo "  3. Site will be deployed to https://devonepao.github.io/solvestack/"
