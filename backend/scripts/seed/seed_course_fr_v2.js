const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LearningPath = require('../../src/models/LearningPath');
const Chapter = require('../../src/models/Chapter');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/languageapp';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Load data from JSON
    const dataPath = path.join(__dirname, '../../data/french_course_data.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error(`Data file not found at ${dataPath}`);
    }
    const courseData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Clean up existing French paths and their chapters
    const existingPaths = await LearningPath.find({ language: 'fr' });
    const pathIds = existingPaths.map(p => p._id);
    await Chapter.deleteMany({ pathId: { $in: pathIds } });
    await LearningPath.deleteMany({ language: 'fr' });
    console.log('Cleared existing French paths and chapters');

    for (const pathItem of courseData) {
        // Create LearningPath
        const learningPath = await LearningPath.create({
            language: pathItem.language || 'fr',
            level: pathItem.level,
            order: pathItem.order,
            title: pathItem.title,
            description: pathItem.description,
            isLocked: pathItem.order > 1
        });
        console.log(`Created Path: ${learningPath.title}`);

        // Create Chapters for this path
        const chaptersWithIds = pathItem.chapters.map(ch => ({
            ...ch,
            pathId: learningPath._id
        }));

        await Chapter.insertMany(chaptersWithIds);
        console.log(`  Seeded ${chaptersWithIds.length} chapters for "${learningPath.title}"`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();
