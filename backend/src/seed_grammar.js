require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function seedDatabase() {
  const dataPath = path.join(__dirname, '..', 'spanish_grammar_db.json');
  console.log(`Reading JSON from ${dataPath}`);
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const { book, parts, chapters, sections, examples } = raw.tables;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/language_app';
  console.log(`Connecting to MongoDB at ${mongoUri}`);
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();

    // Map `id` to `_id` and deduplicate
    const mapId = (docs) => {
      if (!docs) return [];
      const uniq = {};
      docs.forEach((doc) => {
        if (doc.id && !doc._id) {
          doc._id = doc.id;
        }
        if (doc._id && !uniq[doc._id]) {
          uniq[doc._id] = doc;
        }
      });
      return Object.values(uniq);
    };

    console.log('Clearing existing grammar collections...');
    await db.collection('grammarbooks').deleteMany({});
    await db.collection('grammarparts').deleteMany({});
    await db.collection('grammarchapters').deleteMany({});
    await db.collection('grammarsections').deleteMany({});
    await db.collection('grammarexamples').deleteMany({});

    console.log('Inserting books & parts...');
    if (book && book.length > 0) await db.collection('grammarbooks').insertMany(mapId(book));
    if (parts && parts.length > 0) await db.collection('grammarparts').insertMany(mapId(parts));

    console.log(`Inserting ${chapters.length} chapters...`);
    if (chapters && chapters.length > 0) await db.collection('grammarchapters').insertMany(mapId(chapters));

    console.log(`Inserting ${sections.length} sections...`);
    if (sections && sections.length > 0) await db.collection('grammarsections').insertMany(mapId(sections));

    console.log(`Inserting ${examples.length} examples...`);
    const mappedExamples = mapId(examples);
    const BATCH = 500;
    for (let i = 0; i < mappedExamples.length; i += BATCH) {
      await db.collection('grammarexamples').insertMany(mappedExamples.slice(i, i + BATCH));
      console.log(`Inserted examples ${i} to ${Math.min(i + BATCH, mappedExamples.length)}`);
    }

    console.log('Creating indexes (if not exist)...');
    await db.collection('grammarchapters').createIndex({ part_id: 1 });
    await db.collection('grammarchapters').createIndex({ difficulty: 1 });
    await db.collection('grammarchapters').createIndex({ tags: 1 });
    await db.collection('grammarchapters').createIndex({ slug: 1 }, { unique: true });

    await db.collection('grammarsections').createIndex({ chapter_id: 1 });

    await db.collection('grammarexamples').createIndex({ chapter_id: 1 });
    await db.collection('grammarexamples').createIndex({ tags: 1 });
    await db.collection('grammarexamples').createIndex({ section_id: 1 });

    console.log('✅ Database seeded successfully');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedDatabase();
