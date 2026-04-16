const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const LearningPath = require('../../src/models/LearningPath');
const Chapter = require('../../src/models/Chapter');
const Lexicon = require('../../src/models/Lexicon');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/languageapp';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // ─── PART 1: Lexicon Seeding (100+ entries) ───
    console.log('Clearing existing French lexicon...');
    await Lexicon.deleteMany({ language: 'fr' });

    const lexiconEntries = [];
    const categories = ['words', 'expressions'];
    const levels = ['A1', 'A2', 'B1'];
    
    // Exact topics expected by slugToTopic in app/lexicon/[type].tsx
    const uiTopics = [
      'Greetings', 'Numbers', 'Food and Drink', 'Transport', 'Family', 
      'Home', 'Body Parts', 'Clothing', 'Weather', 'Work & School'
    ];

    // Generate ~150 lexicon entries distributed across the UI topics
    for (let i = 1; i <= 150; i++) {
        const cat = i % 10 === 0 ? 'expressions' : 'words'; // mostly words
        const lvl = levels[i % levels.length];
        const top = uiTopics[i % uiTopics.length];
        
        lexiconEntries.push({
            language: 'fr',
            category: cat,
            level: lvl,
            topic: top,
            term: cat === 'words' ? `Mot ${i}` : `Expression ${i}`,
            definition: `Définition pour le terme ${i} (${top})`,
            example: `Exemple d'usage pour ${i}.`,
            translation: `Translation ${i}`,
            isFree: true
        });
    }

    await Lexicon.insertMany(lexiconEntries);
    console.log(`Successfully seeded ${lexiconEntries.length} lexicon entries.`);

    // ─── PART 2: Learning Paths & Chapters (10 paths, 100 chapters) ───
    console.log('Clearing existing French paths and chapters...');
    const existingPaths = await LearningPath.find({ language: 'fr' });
    const pathIds = existingPaths.map(p => p._id);
    await Chapter.deleteMany({ pathId: { $in: pathIds } });
    await LearningPath.deleteMany({ language: 'fr' });

    const pathThemes = [
        "Basic Foundations", "Daily Routines", "Travel & Adventure", "Social Life", 
        "French Gastronomy", "Business French", "Health & Wellness", "History & Art", 
        "Nature & Environment", "Advanced Debate"
    ];

    const levelsMap = ["survival", "confidence", "fluency", "mastery", "survival", "confidence", "fluency", "mastery", "fluency", "mastery"];

    for (let pIdx = 0; pIdx < pathThemes.length; pIdx++) {
        const pathData = await LearningPath.create({
            language: 'fr',
            level: levelsMap[pIdx] || 'survival',
            order: pIdx + 1,
            title: pathThemes[pIdx],
            description: `Complete guide to ${pathThemes[pIdx]} in French.`,
            isLocked: pIdx > 0
        });

        const pathChapters = [];
        for (let cIdx = 1; cIdx <= 10; cIdx++) {
            pathChapters.push({
                pathId: pathData._id,
                order: cIdx,
                title: `${pathThemes[pIdx]} - Step ${cIdx}`,
                topic: pathThemes[pIdx].split(' ')[0],
                tabs: {
                    read: {
                        passage: `Ceci est le passage de lecture pour le chapitre ${cIdx} du module ${pathThemes[pIdx]}. Le texte contient des informations importantes sur le sujet traité dans cette leçon.`,
                        vocabulary: [
                            { word: `Mot ${pIdx}-${cIdx}-1`, definition: 'Definition 1' },
                            { word: `Mot ${pIdx}-${cIdx}-2`, definition: 'Definition 2' }
                        ],
                        comprehensionQuestions: [
                            { question: `Question de compréhension ${cIdx}?`, options: ['Oui', 'Non', 'Peut-être'], correctAnswer: 'Oui', explanation: 'Explication détaillée.' }
                        ]
                    },
                    listen: {
                        audioUrl: `https://example.com/audio/fr_${pIdx}_${cIdx}.mp3`,
                        transcript: `Transcription audio pour le chapitre ${cIdx}. Bonjour et bienvenue dans cette leçon !`,
                        mode: cIdx % 2 === 0 ? 'dialogue' : 'monologue'
                    },
                    speak: {
                        dialogue: [
                            { speaker: 'Alice', target: 'Bonjour, comment ça va ?', translation: 'Hello, how are you?', phonetics: '/bɔ̃.ʒuʁ kɔ.mɑ̃ sa va/' },
                            { speaker: 'Bob', target: 'Ça va bien, merci !', translation: 'I am fine, thanks!', phonetics: '/sa va bjɛ̃ mɛʁ.si/' }
                        ],
                        keyPhrases: [
                            { phrase: 'D\'accord', phonetics: '/da.kɔʁ/', translation: 'Okay' },
                            { phrase: 'S\'il vous plaît', phonetics: '/sil vu plɛ/', translation: 'Please' }
                        ],
                        commonMistakes: [
                            { mistake: 'Incorrect usage of Tu', correction: 'Use Vous with strangers', explanation: 'Formal vs Informal' }
                        ],
                        culturalNote: 'In France, food is a very serious social activity.',
                        rolePlayPrompt: 'Try to introduce yourself to a local.',
                        rolePlayModelAnswer: 'Bonjour, je m\'appelle Marie.'
                    },
                    write: {
                        task: `Rédigez un court paragraphe sur ${pathThemes[pIdx]} en utilisant au moins 5 nouveaux mots.`,
                        exampleResponse: 'Je m\'appelle Jean et j\'aime apprendre le français.',
                        options: [
                            { prompt: 'Traduisez: Hello my friend', correctAnswer: 'Bonjour mon ami', distractors: ['Salut ami', 'Au revoir'] }
                        ]
                    }
                },
                quizQuestions: [
                    { question: `Quelle est la traduction de "Step ${cIdx}"?`, type: 'multiple_choice', options: [`Étape ${cIdx}`, 'Saut', 'Course'], correctAnswer: `Étape ${cIdx}`, explanation: 'Standard translation.' },
                    { question: `Le français est une langue difficile?`, type: 'true_false', options: ['Vrai', 'Faux'], correctAnswer: 'Faux', explanation: 'Avec de la pratique, tout est possible!' }
                ]
            });
        }
        await Chapter.insertMany(pathChapters);
        console.log(`Seeded path "${pathThemes[pIdx]}" with 10 chapters.`);
    }

    console.log('Total Seeding Complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();
