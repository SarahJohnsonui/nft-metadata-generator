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

async function generateBatch(count, collectionName = "My NFT Collection") {
  console.log(`Starting batch generation of ${count} NFTs...`);
  
  for (let i = 1; i <= count; i++) {
    const metadata = generateMetadata(
      i,
      `${collectionName} #${i}`,
      `A unique NFT from ${collectionName}`,
      `https://gateway.pinata.cloud/ipfs/YOUR_HASH/${i}.png`,
      [
        { trait_type: "Background", value: "Default" },
        { trait_type: "Type", value: "Standard" }
      ]
    );
    
    await writeMetadataToFile(metadata, i);
  }
  
  console.log(`✅ Generated ${count} metadata files!`);
}

async function init() {
  try {
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    
    // Generate 5 sample NFTs
    await generateBatch(5, "Sample Collection");
    
    console.log('Batch generation completed!');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
}

init();