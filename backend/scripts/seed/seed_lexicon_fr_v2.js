const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Lexicon = require('../../src/models/Lexicon');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/languageapp';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Load data from JSON
    const dataPath = path.join(__dirname, '../../data/french_lexicon_data.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error(`Data file not found at ${dataPath}`);
    }
    const lexiconData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Clearing existing French lexicon entries...');
    await Lexicon.deleteMany({ language: 'fr' });
    console.log('Cleared existing French lexicon.');

    const result = await Lexicon.insertMany(lexiconData);
    console.log(`Successfully seeded ${result.length} French lexicon entries.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();
