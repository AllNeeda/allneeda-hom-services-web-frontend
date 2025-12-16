# Vercel Deployment Guide using GitHub Actions

This guide will walk you through setting up automated deployment to Vercel using GitHub Actions.

## Prerequisites

1. A GitHub account with your repository
2. A Vercel account (sign up at https://vercel.com)
3. Your Next.js project pushed to GitHub

## Step-by-Step Process

### Step 1: Create a Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure your project settings:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (or your project root)
   - Build Command: `npm run build` (should be auto-detected)
   - Output Directory: `.next` (should be auto-detected)
   - Install Command: `npm ci` or `npm install`

5. **Important**: After creating the project, note down:
   - **Project ID** (found in project settings → General)
   - **Organization ID** (found in project settings → General)

### Step 2: Generate Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a name (e.g., "GitHub Actions Deployment")
4. Set expiration (or leave as "No expiration")
5. Click **"Create"**
6. **Copy the token immediately** (you won't be able to see it again)

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add the following secrets:

   - **Name**: `VERCEL_TOKEN`
     **Value**: The token you copied in Step 2

   - **Name**: `VERCEL_ORG_ID`
     **Value**: Your Organization ID from Step 1

   - **Name**: `VERCEL_PROJECT_ID`
     **Value**: Your Project ID from Step 1

### Step 4: Add Environment Variables (if needed)

If your app uses environment variables:

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add all your environment variables there
3. They will be automatically available during build and runtime

**OR** add them as GitHub Secrets and reference them in the workflow file.

### Step 5: Push to GitHub

The workflow file (`.github/workflows/deploy-vercel.yml`) is already created. Simply:

1. Commit and push the changes:
   ```bash
   git add .github/workflows/deploy-vercel.yml
   git add .vercelignore
   git commit -m "Add Vercel deployment workflow"
   git push origin main
   ```

### Step 6: Verify Deployment

1. Go to your GitHub repository → **Actions** tab
2. You should see the workflow running
3. Once complete, check the Vercel dashboard for your deployment
4. Your app will be live at: `https://your-project-name.vercel.app`

## How It Works

- **On Push to main/master**: Automatically deploys to Vercel production
- **On Pull Request**: Creates a preview deployment (you can modify the workflow to enable this)

## Troubleshooting

### Build Fails

1. Check the GitHub Actions logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (currently set to Node 20)

### Deployment Fails

1. Verify all three secrets are correctly set in GitHub
2. Check that the Vercel token hasn't expired
3. Ensure Project ID and Org ID are correct

### Environment Variables Not Working

1. Add them in Vercel Dashboard → Settings → Environment Variables
2. Or modify the workflow file to include them in the build step

## Customization

### Deploy Only on Specific Branches

Edit `.github/workflows/deploy-vercel.yml`:
```yaml
on:
  push:
    branches:
      - main  # Change to your production branch
```

### Add Preview Deployments for PRs

The workflow already includes PR triggers. To enable preview deployments, modify the deploy step:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: ${{ github.event_name == 'pull_request' && '--preview' || '--prod' }}
```

### Add Build-Time Environment Variables

Uncomment and modify the build step:
```yaml
- name: Build project
  run: npm run build
  env:
    NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
    # Add more variables as needed
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI](https://vercel.com/docs/cli)

