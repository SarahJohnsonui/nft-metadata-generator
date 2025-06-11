const rarityWeights = {
  "Background": {
    "Blue": 40,    // Common
    "Red": 30,     // Common
    "Green": 20,   // Uncommon
    "Purple": 8,   // Rare
    "Yellow": 2    // Legendary
  },
  "Body": {
    "Human": 50,   // Common
    "Robot": 30,   // Common
    "Alien": 15,   // Uncommon
    "Monster": 5   // Rare
  },
  "Eyes": {
    "Normal": 60,  // Common
    "Glow": 25,    // Common
    "Laser": 10,   // Uncommon
    "Closed": 5    // Rare
  },
  "Accessory": {
    "None": 70,       // Common
    "Hat": 15,        // Uncommon
    "Glasses": 10,    // Uncommon
    "Necklace": 5     // Rare
  }
};

function getWeightedRandomAttribute(traitType, options) {
  const weights = rarityWeights[traitType] || {};
  
  // If no weights defined, use equal probability
  if (Object.keys(weights).length === 0) {
    const randomIndex = Math.floor(Math.random() * options.length);
    return { trait_type: traitType, value: options[randomIndex] };
  }
  
  // Calculate total weight
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  // Generate random number
  let random = Math.random() * totalWeight;
  
  // Select based on weight
  for (const [value, weight] of Object.entries(weights)) {
    if (options.includes(value)) {
      random -= weight;
      if (random <= 0) {
        return { trait_type: traitType, value: value };
      }
    }
  }
  
  // Fallback to first option
  return { trait_type: traitType, value: options[0] };
}

function calculateRarityScore(attributes) {
  let score = 0;
  
  for (const attr of attributes) {
    const weights = rarityWeights[attr.trait_type];
    if (weights && weights[attr.value]) {
      // Lower weight = higher rarity score
      score += (100 - weights[attr.value]);
    }
  }
  
  return score;
}

module.exports = {
  getWeightedRandomAttribute,
  calculateRarityScore,
  rarityWeights
};