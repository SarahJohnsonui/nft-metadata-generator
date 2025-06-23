const fs = require('fs-extra');
const path = require('path');
const { getWeightedRandomAttribute, calculateRarityScore } = require('./rarity');
const { validateMetadata, validateConfig } = require('./validator');

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
    outputDir = config.output?.directory || './output';
    
    // Validate configuration
    const validation = validateConfig(config);
    if (!validation.isValid) {
      console.error('Configuration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Invalid configuration');
    }
    
    console.log('Configuration loaded and validated successfully');
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
    // Validate metadata before writing
    const validation = validateMetadata(metadata);
    if (!validation.isValid) {
      console.error(`Validation failed for token ${tokenId}:`);
      validation.errors.forEach(error => console.error(`  - ${error}`));
      return null;
    }
    
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

function previewMetadata(metadata) {
  console.log('\n--- METADATA PREVIEW ---');
  console.log(`Name: ${metadata.name}`);
  console.log(`Description: ${metadata.description}`);
  console.log(`Token ID: ${metadata.tokenId}`);
  console.log(`Rarity Score: ${metadata.rarityScore}`);
  console.log('Attributes:');
  metadata.attributes.forEach(attr => {
    console.log(`  ${attr.trait_type}: ${attr.value}`);
  });
  console.log(`Image: ${metadata.image}`);
  console.log('--- END PREVIEW ---\n');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Handle preview command
  if (command === 'preview') {
    try {
      await loadConfig();
      console.log('\n🔍 Generating sample metadata preview...');
      
      const randomAttributes = generateRandomAttributes(config.attributes);
      const imageUrl = `${config.collection.baseImageUrl}/preview.png`;
      
      const sampleMetadata = generateMetadata(
        1,
        `${config.collection.name} #1`,
        `${config.collection.description} - Preview`,
        imageUrl,
        randomAttributes
      );
      
      previewMetadata(sampleMetadata);
      return;
    } catch (error) {
      console.error('Error during preview:', error.message);
      return;
    }
  }
  
  // Handle normal generation
  const count = command ? parseInt(command) : 10;
  
  if (isNaN(count) || count <= 0) {
    console.error('Please provide a valid number of NFTs to generate');
    console.log('Usage:');
    console.log('  node index.js [count]     - Generate metadata files');
    console.log('  node index.js preview     - Preview sample metadata');
    console.log('Examples:');
    console.log('  node index.js 100');
    console.log('  node index.js preview');
    return;
  }
  
  try {
    await loadConfig();
    await fs.ensureDir(outputDir);
    console.log('Output directory ready');
    console.log(`Generating ${count} NFTs from ${config.collection.name}...`);
    
    await generateBatch(count);
    
    console.log('Generation completed!');
    console.log(`Check the ${outputDir} folder for your metadata files.`);
  } catch (error) {
    console.error('Error during generation:', error.message);
  }
}

main();