# NFT Metadata Generator

A tool to generate metadata for NFT collections with rarity support.

## Getting Started

```bash
npm install
node index.js [count]
```

## Usage

Generate metadata files:
```bash
node index.js 100        # Generate 100 NFT metadata files
node index.js            # Generate 10 NFT metadata files (default)
```

Preview sample metadata:
```bash
node index.js preview    # Preview a sample NFT metadata
```

## Features

- ✅ Generate NFT metadata files
- ✅ Configurable attributes and rarity weights
- ✅ OpenSea compatible JSON format  
- ✅ Batch generation with progress tracking
- ✅ Metadata validation
- ✅ Preview functionality
- ✅ Weighted random attribute selection

## Configuration

Edit `config.json` to customize your collection settings, attributes, and rarity weights.