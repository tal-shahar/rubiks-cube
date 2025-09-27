# AWS S3 + CloudFront Deployment Guide for Rubik's Cube

This guide will help you deploy your Rubik's Cube React application to AWS S3 with CloudFront using GitHub Actions for automated deployment.

## Prerequisites

- AWS Account
- GitHub repository
- Node.js 18+ (for local development)

## Step 1: Verify S3 Bucket Configuration

Since your bucket `rubiks-cube-site` is already created, let's verify it's configured correctly:

1. **Go to AWS S3 Console**
   - Navigate to [AWS S3 Console](https://s3.console.aws.amazon.com/)
   - Find your existing bucket `rubiks-cube-site`

2. **Check Bucket Settings**
   - Click on your bucket name
   - Go to "Properties" tab
   - Verify these settings:
     - **Bucket name**: `rubiks-cube-site`
     - **Region**: Note your region (e.g., `us-east-1`)
     - **Bucket Versioning**: Enable if not already enabled
     - **Default encryption**: Enable if not already enabled

3. **Verify Public Access Settings**
   - Go to "Permissions" tab
   - Under "Block public access (bucket settings)"
   - **IMPORTANT**: Keep "Block all public access" **CHECKED** (CloudFront will access it privately)
   - If it's unchecked, click "Edit" and check all boxes, then save

4. **Check Object Ownership** (Optional)
   - In "Permissions" tab, find "Object Ownership"
   - If available, ensure "ACLs disabled (recommended)" is selected
   - If not visible, the default setting is fine

## Step 2: Create CloudFront Distribution

1. **Go to CloudFront Console**
   - Navigate to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
   - Click "Create distribution"

2. **Configure Origin**
   - **Origin domain**: Select your S3 bucket (`rubiks-cube-site.s3.amazonaws.com`)
   - **Origin path**: Leave empty
   - **Origin access**: Select "Origin access control settings (recommended)"
   - Click "Create control setting"
     - **Name**: `rubiks-cube-oac`
     - **Signing behavior**: Sign requests (recommended)
     - **Origin type**: S3
     - Click "Create"

3. **Configure Default Cache Behavior**
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Cache policy**: CachingOptimized
   - **Origin request policy**: CORS-S3Origin
   - **Response headers policy**: SimpleCORS
   - **Compress objects automatically**: Yes

4. **Configure Distribution Settings**
   - **Price class**: Choose based on your needs (US, Canada and Europe for cost savings)
   - **Alternate domain names**: (Optional) Add your custom domain
   - **Default root object**: `index.html`
   - **Custom error pages**: 
     - **HTTP error code**: 403
     - **Error page path**: `/index.html`
     - **Response page path**: `/index.html`
     - **HTTP response code**: 200

5. **Create Distribution**
   - Click "Create distribution"
   - **IMPORTANT**: Copy the Distribution ID (e.g., `E1234567890ABC`) for GitHub secrets
   - Note: Distribution creation takes 5-15 minutes

## Step 3: Update S3 Bucket Policy for CloudFront

1. **Go to S3 Bucket Permissions**
   - Navigate to your `rubiks-cube-site` bucket
   - Go to Permissions tab → Bucket policy

2. **Add CloudFront Access Policy**
   - Click "Edit" and add this policy (replace `YOUR_ACCOUNT_ID` with your AWS account ID):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::rubiks-cube-site/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/EHDQTTUY3DURC"
                }
            }
        }
    ]
}
```

**Note**: Replace `YOUR_ACCOUNT_ID` with your AWS account ID. Your CloudFront distribution ID is `EHDQTTUY3DURC`.

## Step 4: Create IAM User for GitHub Actions

1. **Create IAM User**
   - Go to [IAM Console](https://console.aws.amazon.com/iam/)
   - Click "Users" → "Create user"
   - **Username**: `github-actions-rubiks-cube`
   - Click "Next"

2. **Attach Policies**
   - Click "Attach policies directly"
   - Add these policies:
     - `AmazonS3FullAccess`
     - `CloudFrontFullAccess`
   - Click "Next" → "Create user"

3. **Create Access Keys**
   - Click on the created user
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Select "Application running outside AWS"
   - Click "Next" → "Create access key"
   - **IMPORTANT**: Copy the Access Key ID and Secret Access Key

## Step 5: Configure GitHub Secrets

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click "Settings" → "Secrets and variables" → "Actions"

2. **Add Repository Secrets**
   - Click "New repository secret"
   - Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | Your access key ID | From Step 4 |
| `AWS_SECRET_ACCESS_KEY` | Your secret access key | From Step 4 |
| `AWS_REGION` | `us-east-1` | Your S3 bucket region |
| `AWS_S3_BUCKET_NAME` | `rubiks-cube-site` | Your S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | `EHDQTTUY3DURC` | CloudFront distribution ID from Step 2 |

## Step 6: Deploy Your Application

### Automatic Deployment (Recommended)

1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Add AWS S3 + CloudFront deployment"
   git push origin main
   ```

2. **Monitor GitHub Actions**
   - Go to your repository → "Actions" tab
   - Watch the deployment workflow run
   - Check for any errors

### Manual Deployment (Local)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_S3_BUCKET_NAME="rubiks-cube-site"
   export AWS_REGION="us-east-1"
   export CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"
   ```

3. **Deploy**
   ```bash
   npm run deploy:s3
   ```

## Step 7: Access Your Application

After successful deployment, your application will be available at:

- **CloudFront URL**: `https://EHDQTTUY3DURC.cloudfront.net` (primary URL)
- **S3 Direct URL**: `https://rubiks-cube-site.s3.amazonaws.com` (not recommended for public access)

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Check S3 bucket policy allows CloudFront access
   - Verify CloudFront distribution is properly configured
   - Ensure bucket name in secrets matches actual bucket

2. **GitHub Actions Fails**
   - Check all required secrets are set (including CloudFront distribution ID)
   - Verify IAM user has correct permissions
   - Check AWS region matches bucket region

3. **Files Not Updating**
   - CloudFront cache may need invalidation (automatically handled by GitHub Actions)
   - Check if CloudFront distribution ID is set in secrets
   - Wait 5-15 minutes for CloudFront propagation

4. **CloudFront Distribution Not Working**
   - Ensure S3 bucket policy includes the correct CloudFront distribution ARN
   - Check that Origin Access Control is properly configured
   - Verify custom error pages are set for SPA routing

### Useful Commands

```bash
# Test local build
npm run build

# Serve locally
npm run serve

# Check deployment status
aws s3 ls s3://rubiks-cube-site --recursive

# Check CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Invalidate CloudFront cache manually
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Security Best Practices

1. **Use IAM Roles** (for production)
   - Create IAM role instead of access keys
   - Use OIDC for GitHub Actions

2. **Limit Permissions**
   - Create custom IAM policy with minimal required permissions
   - Use bucket-specific policies
   - Keep S3 bucket private (only CloudFront can access)

3. **Enable Logging**
   - Enable S3 access logging
   - Enable CloudFront access logs
   - Monitor CloudTrail for API calls

4. **CloudFront Security**
   - Use Origin Access Control (OAC) for S3 access
   - Enable HTTPS redirect
   - Set up security headers

## Cost Optimization

1. **S3 Storage**
   - Use S3 Intelligent-Tiering for automatic cost optimization
   - Set lifecycle policies for old versions

2. **CloudFront**
   - Choose appropriate price class (US, Canada, Europe for cost savings)
   - Use compression to reduce bandwidth costs
   - Set up cache behaviors for optimal performance

3. **Monitoring**
   - Set up billing alerts
   - Monitor usage in AWS Cost Explorer
   - Use CloudWatch for performance monitoring

## Next Steps

- Set up custom domain with Route 53
- Configure SSL certificate with ACM
- Set up monitoring and alerts
- Implement CI/CD with multiple environments
- Add custom error pages for better UX

## Why CloudFront + S3?

### **Benefits over S3 Website Hosting:**
- ✅ **HTTPS by default** - Secure connections
- ✅ **Global CDN** - Faster loading worldwide
- ✅ **Custom domains** - Professional URLs
- ✅ **Compression** - Reduced bandwidth costs
- ✅ **Security headers** - Better protection
- ✅ **Cache invalidation** - Controlled updates
- ✅ **Origin Access Control** - Secure S3 access

### **Architecture:**
```
User → CloudFront (CDN) → S3 Bucket (Private)
```

---

For questions or issues, check the [GitHub Actions logs](https://github.com/your-username/your-repo/actions) or refer to the [AWS CloudFront documentation](https://docs.aws.amazon.com/cloudfront/).
