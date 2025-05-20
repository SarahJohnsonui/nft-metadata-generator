const fs = require('fs-extra');
const path = require('path');

console.log('NFT Metadata Generator v0.1.0');
console.log('Starting up...');

const outputDir = './output';

function generateMetadata(tokenId, name, description, imageUrl, attributes = []) {
  return {
    name: name,
    description: description,
    image: imageUrl,
    attributes: attributes,
    tokenId: tokenId
  };
}

function generateSampleMetadata() {
  const sampleAttributes = [
    { trait_type: "Background", value: "Blue" },
    { trait_type: "Body", value: "Robot" },
    { trait_type: "Eyes", value: "Laser" }
  ];
  
  return generateMetadata(
    1,
    "Sample NFT #1", 
    "This is a sample NFT for testing",
    "https://example.com/image/1.png",
    sampleAttributes
  );
}

async function init() {
  try {
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    
    const sampleData = generateSampleMetadata();
    console.log('Generated sample metadata:', JSON.stringify(sampleData, null, 2));
    
    console.log('Ready to generate NFT metadata!');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
}

init();