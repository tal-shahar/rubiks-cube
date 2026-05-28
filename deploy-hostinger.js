#!/usr/bin/env node

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');
const FTP_SERVER = process.env.HOSTINGER_FTP_SERVER;
const FTP_USERNAME = process.env.HOSTINGER_FTP_USERNAME;
const FTP_PASSWORD = process.env.HOSTINGER_FTP_PASSWORD;
const FTP_PORT = parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10);
const FTP_REMOTE_DIR = process.env.HOSTINGER_FTP_REMOTE_DIR || '/public_html/';
const FTP_SECURE = process.env.HOSTINGER_FTP_SECURE === 'true';

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ ${name} is required`);
    process.exit(1);
  }
}

async function deployToHostinger() {
  requireEnv('HOSTINGER_FTP_SERVER', FTP_SERVER);
  requireEnv('HOSTINGER_FTP_USERNAME', FTP_USERNAME);
  requireEnv('HOSTINGER_FTP_PASSWORD', FTP_PASSWORD);

  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ build/ not found. Run npm run build first.');
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true';

  try {
    console.log('🚀 Deploying to Hostinger...');
    console.log(`📡 Server: ${FTP_SERVER}:${FTP_PORT}`);
    console.log(`📁 Remote: ${FTP_REMOTE_DIR}`);

    await client.access({
      host: FTP_SERVER,
      user: FTP_USERNAME,
      password: FTP_PASSWORD,
      port: FTP_PORT,
      secure: FTP_SECURE,
    });

    await client.ensureDir(FTP_REMOTE_DIR);
    await client.cd(FTP_REMOTE_DIR);
    await client.uploadFromDir(BUILD_DIR);

    console.log('\n🎉 Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

if (require.main === module) {
  deployToHostinger();
}

module.exports = { deployToHostinger };
