# Hostinger Deployment Guide for Rubik's Cube

This guide covers deploying the React build to Hostinger shared hosting via FTP/FTPS, including automated deployment with GitHub Actions.

## Prerequisites

- Hostinger hosting plan with a website configured
- FTP account created in hPanel
- GitHub repository with Actions enabled

## Step 1: Get FTP credentials from hPanel

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Go to **Websites** → select your site → **Manage**.
3. Open **Files** → **FTP Accounts** (or **FTP** under Advanced).
4. Create or note an FTP account:
   - **Hostname**: often `ftp.yourdomain.com` (shown in hPanel)
   - **Username**: e.g. `u123456789` or `u123456789@yourdomain.com`
   - **Password**: set when creating the account
   - **Port**: `21` for FTP/FTPS (GitHub Action uses FTPS on this port)

5. Confirm the web root path. For most shared plans it is:
   - `/public_html/`
   - Or `/domains/yourdomain.com/public_html/` if hPanel shows that path

## Step 2: Add GitHub Secrets

In your repo: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

| Secret | Description | Example |
|--------|-------------|---------|
| `HOSTINGER_FTP_SERVER` | FTP hostname from hPanel | `ftp.yourdomain.com` |
| `HOSTINGER_FTP_USERNAME` | FTP username | `u123456789` |
| `HOSTINGER_FTP_PASSWORD` | FTP password | *(your password)* |
| `HOSTINGER_FTP_REMOTE_DIR` | Remote folder for the site | `/public_html/` |

## Step 3: Deploy

### Automatic (recommended)

Push to `main`:

```bash
git add .
git commit -m "Deploy to Hostinger"
git push origin main
```

The workflow runs tests, builds, then uploads `build/` to Hostinger via FTPS.

### Manual from your machine

1. Build:

   ```bash
   npm run build
   ```

2. Set environment variables (PowerShell example):

   ```powershell
   $env:HOSTINGER_FTP_SERVER="ftp.yourdomain.com"
   $env:HOSTINGER_FTP_USERNAME="u123456789"
   $env:HOSTINGER_FTP_PASSWORD="your-password"
   $env:HOSTINGER_FTP_REMOTE_DIR="/public_html/"
   ```

3. Deploy:

   ```bash
   npm run deploy:hostinger
   ```

   For explicit FTPS locally:

   ```powershell
   $env:HOSTINGER_FTP_SECURE="true"
   npm run deploy:hostinger
   ```

### Manual upload (no script)

1. Run `npm run build`.
2. In hPanel, open **File Manager** → `public_html`.
3. Upload everything inside the local `build/` folder (not the `build` folder itself).

## Step 4: Verify

Open your domain in a browser. You should see the Rubik's Cube app.

If assets fail to load, confirm files sit directly under `public_html` (e.g. `public_html/index.html`, `public_html/static/...`).

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| FTP login failed | Username, password, hostname; try FTPS (`HOSTINGER_FTP_SECURE=true` locally) |
| Empty or wrong site | `HOSTINGER_FTP_REMOTE_DIR` must match hPanel’s document root |
| 403 / 404 on refresh | `public/.htaccess` is copied into `build/` on build; rebuild and redeploy |
| GitHub Action deploy fails | Secrets spelled exactly as above; port `21` for FTPS |

## Removing old AWS setup

Delete these GitHub secrets if you no longer use AWS:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `AWS_REGION`
