const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const buildTime = new Date().toISOString();

// Configuration
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'rubiks-cube-site';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const CLOUDFRONT_DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID || '';

console.log(`🚀 Deploying Rubik's Cube v${version} to S3...`);

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  // In GitHub Actions, credentials are automatically provided by the configure-aws-credentials action
  // For local development, you can set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {})
});

// Function to upload a file to S3
async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: getCacheControl(filePath),
  };

  // Note: Removed gzip encoding to fix ERR_CONTENT_DECODING_FAILED
  // CloudFront will handle compression automatically

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    console.log(`✅ Uploaded: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${key}:`, error.message);
    return false;
  }
}

// Function to get cache control headers
function getCacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  
  // Service worker - no cache to ensure updates
  if (fileName === 'sw.js') {
    return 'no-cache, no-store, must-revalidate';
  }
  
  // Static assets with version in filename - cache for 1 year
  if (['.js', '.css'].includes(ext) && (fileName.includes('main.') || fileName.includes('bundle.'))) {
    return 'public, max-age=31536000, immutable';
  }
  
  // Other static assets - cache for 1 year
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
    return 'public, max-age=31536000, immutable';
  }
  
  // HTML files - short cache with version check
  if (ext === '.html') {
    return 'public, max-age=300, must-revalidate';
  }
  
  // Default - no cache
  return 'no-cache, no-store, must-revalidate';
}

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to clear existing files in S3 bucket
async function clearBucket() {
  try {
    console.log('🧹 Clearing existing files from S3 bucket...');
    
    const listParams = {
      Bucket: BUCKET_NAME,
    };

    let continuationToken;
    do {
      if (continuationToken) {
        listParams.ContinuationToken = continuationToken;
      }

      const listCommand = new ListObjectsV2Command(listParams);
      const response = await s3Client.send(listCommand);

      if (response.Contents && response.Contents.length > 0) {
        for (const object of response.Contents) {
          const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: object.Key,
          };
          
          const deleteCommand = new DeleteObjectCommand(deleteParams);
          await s3Client.send(deleteCommand);
          console.log(`🗑️  Deleted: ${object.Key}`);
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    console.log('✅ Bucket cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear bucket:', error.message);
    throw error;
  }
}

// Main deployment function
async function deployToS3() {
  console.log('🚀 Starting S3 deployment for Rubik\'s Cube...');
  console.log(`📦 Bucket: ${BUCKET_NAME}`);
  console.log(`🌍 Region: ${AWS_REGION}`);

  // Check if build directory exists
  const buildDir = path.join(__dirname, 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Check AWS credentials (only for local development)
  if (process.env.NODE_ENV !== 'production' && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
    console.log('⚠️  AWS credentials not found in environment variables.');
    console.log('   For local development, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    console.log('   For GitHub Actions, credentials are automatically configured');
  }

  try {
    // Clear existing files
    await clearBucket();

    // Get all files in build directory
    const files = getAllFiles(buildDir);
    console.log(`📁 Found ${files.length} files to upload`);

    // Upload all files
    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const relativePath = path.relative(buildDir, file);
      const key = relativePath.replace(/\\/g, '/'); // Ensure forward slashes for S3
      
      const success = await uploadFile(file, key);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n📊 Deployment Summary:');
    console.log(`✅ Successfully uploaded: ${successCount} files`);
    if (failCount > 0) {
      console.log(`❌ Failed to upload: ${failCount} files`);
    }

    if (failCount === 0) {
      console.log('\n🎉 Deployment completed successfully!');
      console.log(`🌐 Your app should be available at: https://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com`);
      
      if (CLOUDFRONT_DISTRIBUTION_ID) {
        console.log(`☁️  CloudFront URL: https://${CLOUDFRONT_DISTRIBUTION_ID}.cloudfront.net`);
        console.log('⚠️  Note: CloudFront cache may take a few minutes to update');
      }
    } else {
      console.log('\n⚠️  Deployment completed with errors');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployToS3();
}

module.exports = { deployToS3 };
