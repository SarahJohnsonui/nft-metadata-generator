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

async function writeMetadataToFile(metadata, tokenId) {
  try {
    const fileName = `${tokenId}.json`;
    const filePath = path.join(outputDir, fileName);
    await fs.writeJSON(filePath, metadata, { spaces: 2 });
    console.log(`Metadata written to: ${fileName}`);
    return filePath;
  } catch (error) {
    console.error(`Error writing metadata for token ${tokenId}:`, error.message);
    throw error;
  }
}

async function init() {
  try {
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    
    const sampleData = generateSampleMetadata();
    console.log('Generated sample metadata:', JSON.stringify(sampleData, null, 2));
    
    await writeMetadataToFile(sampleData, sampleData.tokenId);
    
    console.log('Sample metadata file created successfully!');
    console.log('Ready to generate NFT metadata!');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
}

init();