#!/usr/bin/env node

const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
const fs = require('fs');

// Get configuration
const CLOUDFRONT_DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID || '';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

if (!CLOUDFRONT_DISTRIBUTION_ID) {
  console.error('❌ CLOUDFRONT_DISTRIBUTION_ID environment variable is required');
  console.log('💡 Set it with: export CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id');
  process.exit(1);
}

// Initialize CloudFront client
const cloudFrontClient = new CloudFrontClient({
  region: AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  } : {})
});

async function invalidateCloudFront() {
  try {
    console.log('🔄 Creating CloudFront invalidation...');
    console.log(`📡 Distribution ID: ${CLOUDFRONT_DISTRIBUTION_ID}`);
    
    const invalidationParams = {
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `manual-invalidation-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ['/*'] // Invalidate all paths
        }
      }
    };

    const command = new CreateInvalidationCommand(invalidationParams);
    const result = await cloudFrontClient.send(command);
    
    console.log('✅ CloudFront invalidation created successfully!');
    console.log(`🆔 Invalidation ID: ${result.Invalidation.Id}`);
    console.log('⏳ Invalidation typically takes 5-15 minutes to complete');
    console.log('🌐 Check your CloudFront distribution in the AWS console for status');
    
  } catch (error) {
    console.error('❌ Failed to create CloudFront invalidation:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('💡 You may need to add CloudFront invalidation permissions to your AWS credentials');
    } else if (error.name === 'NoSuchDistribution') {
      console.log('💡 Check that your CLOUDFRONT_DISTRIBUTION_ID is correct');
    }
    
    process.exit(1);
  }
}

// Run the invalidation
invalidateCloudFront();
