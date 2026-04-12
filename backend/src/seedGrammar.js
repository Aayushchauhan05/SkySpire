const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Models
const GrammarBook = require('./models/GrammarBook');
const GrammarPart = require('./models/GrammarPart');
const GrammarChapter = require('./models/GrammarChapter');
const GrammarSection = require('./models/GrammarSection');
const GrammarExample = require('./models/GrammarExample');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/language-app';
    await mongoose.connect(uri);
    console.log('MongoDB Connected for seeding grammar data...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedGrammarData = async () => {
  try {
    const filesToSeed = [
      { path: '../grammar_db.json', prefix: 'eng_grammar_' },
      { path: '../spanish_grammar_db.json', prefix: 'esp_grammar_' }
    ];

    await connectDB();

    for (const fileInfo of filesToSeed) {
      const jsonPath = path.join(__dirname, fileInfo.path);
      if (!fs.existsSync(jsonPath)) {
        console.warn(`⚠️ Warning: ${jsonPath} not found. Skipping.`);
        continue;
      }

      console.log(`Processing ${fileInfo.path}...`);
      const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Handle both flat structure and "tables" structure
      const data = rawData.tables ? {
        book: rawData.tables.book[0],
        parts: rawData.tables.parts,
        chapters: rawData.tables.chapters,
        sections: rawData.tables.sections || [],
        examples: rawData.tables.examples || []
      } : rawData;

      const ID_PREFIX = fileInfo.prefix;

      console.log(`Upserting ${ID_PREFIX} data (no clearing)...`);
      
      // 1. Seed Book
      const bookData = { ...data.book, _id: data.book.id, converted_at: new Date() };
      delete bookData.id;
      await GrammarBook.findOneAndUpdate({ _id: bookData._id }, bookData, { upsert: true, new: true });

      // 2. Seed Parts
      for (const part of data.parts) {
        await GrammarPart.findOneAndUpdate({ _id: part.id }, { ...part, _id: part.id, book_id: data.book.id }, { upsert: true });
      }

      // 3. Seed Chapters
      for (const ch of data.chapters) {
        try {
          await GrammarChapter.findOneAndUpdate({ _id: ch.id }, { ...ch, _id: ch.id }, { upsert: true });
        } catch (err) {
          console.warn(`  ⚠️ Error upserting chapter ${ch.id}: ${err.message}`);
        }
      }

      // 4. Seed Sections
      for (const sec of data.sections) {
        try {
          await GrammarSection.findOneAndUpdate({ _id: sec.id }, { ...sec, _id: sec.id }, { upsert: true });
        } catch (err) {
          // ignore
        }
      }

      // 5. Seed Examples
      for (const ex of data.examples) {
        try {
          await GrammarExample.findOneAndUpdate({ _id: ex.id }, { ...ex, _id: ex.id }, { upsert: true });
        } catch (err) {
          // ignore
        }
      }
    }

    console.log('✅ All Grammar Data Seeded/Updated Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedGrammarData();
