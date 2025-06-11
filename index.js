const fs = require('fs-extra');
const path = require('path');
const { getWeightedRandomAttribute, calculateRarityScore } = require('./rarity');

console.log('NFT Metadata Generator v0.1.0');
console.log('Starting up...');

let config;
let outputDir = './output';

function generateMetadata(tokenId, name, description, imageUrl, attributes = []) {
  const rarityScore = calculateRarityScore(attributes);
  
  return {
    name: name,
    description: description,
    image: imageUrl,
    attributes: attributes,
    tokenId: tokenId,
    rarityScore: rarityScore
  };
}

function getRandomAttribute(traitType, options) {
  const randomIndex = Math.floor(Math.random() * options.length);
  return { trait_type: traitType, value: options[randomIndex] };
}

function generateRandomAttributes(attributesConfig, useRarity = true) {
  const attributes = [];
  
  for (const [traitType, options] of Object.entries(attributesConfig)) {
    if (useRarity) {
      attributes.push(getWeightedRandomAttribute(traitType, options));
    } else {
      attributes.push(getRandomAttribute(traitType, options));
    }
  }
  
  return attributes;
}

async function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    config = await fs.readJSON(configPath);
    outputDir = config.output.directory;
    console.log('Configuration loaded successfully');
  } catch (error) {
    console.log('Using default configuration');
    config = {
      collection: {
        name: "Default Collection",
        description: "Default collection",
        baseImageUrl: "https://example.com",
        totalSupply: 100
      },
      attributes: {
        "Background": ["Blue", "Red"],
        "Type": ["Standard", "Rare"]
      }
    };
  }
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

async function generateBatch(count) {
  console.log(`Starting batch generation of ${count} NFTs...`);
  
  for (let i = 1; i <= count; i++) {
    const randomAttributes = generateRandomAttributes(config.attributes);
    const imageUrl = `${config.collection.baseImageUrl}/${i}.png`;
    
    const metadata = generateMetadata(
      i,
      `${config.collection.name} #${i}`,
      `${config.collection.description} - Token ${i}`,
      imageUrl,
      randomAttributes
    );
    
    await writeMetadataToFile(metadata, i);
    
    if (i % 10 === 0) {
      console.log(`Generated ${i}/${count} metadata files...`);
    }
  }
  
  console.log(`✅ Generated ${count} metadata files!`);
}

async function init() {
  try {
    await loadConfig();
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    
    // Generate 10 random NFTs
    await generateBatch(10);
    
    console.log('Batch generation completed!');
  } catch (error) {
    console.error('Error during initialization:', error.message);
  }
}

init();