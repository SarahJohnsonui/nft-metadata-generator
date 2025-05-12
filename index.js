const fs = require('fs-extra');
const path = require('path');

console.log('NFT Metadata Generator v0.1.0');
console.log('Starting up...');

// Basic setup for now
const outputDir = './output';

async function init() {
  try {
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    console.log('Ready to generate NFT metadata!');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
}

init();