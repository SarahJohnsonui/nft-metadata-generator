function validateMetadata(metadata) {
  const errors = [];
  
  // Check required fields
  if (!metadata.name || typeof metadata.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (!metadata.description || typeof metadata.description !== 'string') {
    errors.push('Description is required and must be a string');
  }
  
  if (!metadata.image || typeof metadata.image !== 'string') {
    errors.push('Image URL is required and must be a string');
  }
  
  if (!metadata.tokenId || typeof metadata.tokenId !== 'number') {
    errors.push('Token ID is required and must be a number');
  }
  
  // Validate image URL format
  if (metadata.image && !isValidUrl(metadata.image)) {
    errors.push('Image must be a valid URL');
  }
  
  // Validate attributes
  if (metadata.attributes) {
    if (!Array.isArray(metadata.attributes)) {
      errors.push('Attributes must be an array');
    } else {
      metadata.attributes.forEach((attr, index) => {
        if (!attr.trait_type || typeof attr.trait_type !== 'string') {
          errors.push(`Attribute ${index}: trait_type is required and must be a string`);
        }
        if (attr.value === undefined || attr.value === null) {
          errors.push(`Attribute ${index}: value is required`);
        }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function validateConfig(config) {
  const errors = [];
  
  if (!config.collection) {
    errors.push('Collection configuration is required');
  } else {
    if (!config.collection.name) {
      errors.push('Collection name is required');
    }
    if (!config.collection.baseImageUrl) {
      errors.push('Base image URL is required');
    }
  }
  
  if (!config.attributes || Object.keys(config.attributes).length === 0) {
    errors.push('At least one attribute type must be configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  validateMetadata,
  validateConfig,
  isValidUrl
};