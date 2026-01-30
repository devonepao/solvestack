# GitHub Pages Deployment

This directory contains the GitHub Actions workflow for automatically building and deploying SolveStack to GitHub Pages.

## Workflow Overview

The deployment workflow (`deploy.yml`) is triggered on:
- Push to the `main` branch
- Manual trigger via GitHub Actions UI (workflow_dispatch)

## Workflow Jobs

### 1. Build
- Checks out the repository
- Sets up Node.js 18
- Installs dependencies using `npm ci`
- Builds the project using `npm run build`
- Adds `.nojekyll` file to prevent Jekyll processing
- Uploads build artifacts for the next jobs

### 2. Test Build
- Downloads the build artifacts
- Verifies the build output structure:
  - Checks for `index.html`
  - Checks for `assets` directory
  - Verifies the base path configuration (`/solvestack/`)
- Lists all build artifacts

### 3. Deploy
- Downloads the verified build artifacts
- Deploys to the `gh-pages` branch using `peaceiris/actions-gh-pages@v3`

## Local Testing

You can test the build process locally using the provided test script:

```bash
./test-build.sh
```

This script will:
1. Clean previous builds
2. Install dependencies
3. Build the project
4. Verify build output
5. Check base path configuration
6. List build artifacts
7. Calculate build size

## Configuration

The base path for GitHub Pages is configured in `vite.config.ts`:

```typescript
base: '/solvestack/'
```

This ensures all assets are loaded from the correct subdirectory when deployed to `https://devonepao.github.io/solvestack/`.

## Required GitHub Settings

For the workflow to work correctly, ensure:

1. **Pages Settings**: Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

2. **Workflow Permissions**: Go to Settings → Actions → General
   - Workflow permissions: Read and write permissions
   - Allow GitHub Actions to create and approve pull requests: ✓

## Monitoring Deployments

You can monitor deployments in:
- **Actions tab**: View workflow runs and logs
- **Deployments**: View deployment history and status
- **Pages**: View the live site at https://devonepao.github.io/solvestack/

## Troubleshooting

### Build Failures
- Check the build logs in the Actions tab
- Run `./test-build.sh` locally to reproduce the issue
- Verify all dependencies are correctly listed in `package.json`

### Deployment Issues
- Verify the `gh-pages` branch exists and has content
- Check GitHub Pages settings are configured correctly
- Ensure the workflow has proper permissions

### Asset Loading Issues
- Verify the base path is correctly set in `vite.config.ts`
- Check that asset paths in the built `index.html` include `/solvestack/`
