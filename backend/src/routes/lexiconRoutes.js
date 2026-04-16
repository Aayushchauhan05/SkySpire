const express = require('express');
const router = express.Router();
const Lexicon = require('../models/Lexicon');

// Hardcoded category display names mappings
const CATEGORY_DISPLAY_NAMES = {
  'words': 'Vocabulary Words',
  'idioms': 'Idioms',
  'phrasal_verbs': 'Phrasal Verbs',
  'slangs': 'Slang',
  'proverbs': 'Proverbs',
  'collocations': 'Collocations',
  'expressions': 'Common Expressions',
  'false_friends': 'False Friends',
  'connectors': 'Connectors',
  'abbreviations': 'Abbreviations'
};

// GET /api/lexicon/categories?language=fr
router.get('/categories', async (req, res, next) => {
  try {
    const { language } = req.query;
    if (!language) return res.status(400).json({ success: false, message: 'Language is required' });

    // Aggregate to find entry counts for each category
    const pipeline = [
      { $match: { language } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ];
    
    const results = await Lexicon.aggregate(pipeline);
    const countMap = results.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const categories = Object.keys(CATEGORY_DISPLAY_NAMES).map(slug => ({
      slug,
      displayName: CATEGORY_DISPLAY_NAMES[slug],
      entryCount: countMap[slug] || 0
    }));

    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/lexicon/topics?language=fr&category=words&level=A1
router.get('/topics', async (req, res, next) => {
  try {
    const { language, category, level } = req.query;
    if (!language || !category || !level) {
      return res.status(400).json({ success: false, message: 'Language, category, and level are required' });
    }

    const topics = await Lexicon.distinct('topic', { language, category, level });
    
    // Sort topics alphabetically
    topics.sort((a, b) => a.localeCompare(b));
    
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
});

// GET /api/lexicon/entries?language=fr&category=words&level=A1&topic=Greetings
router.get('/entries', async (req, res, next) => {
  try {
    const { language, category, level, topic } = req.query;
    if (!language || !category || !level || !topic) {
      return res.status(400).json({ success: false, message: 'Language, category, level, and topic are required' });
    }

    const entries = await Lexicon.find({ language, category, level, topic });
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
});

// GET /api/lexicon/quiz?language=fr&category=words&level=A1&topic=Greetings
router.get('/quiz', async (req, res, next) => {
  try {
    const { language, category, level, topic } = req.query;
    if (!language || !category || !level || !topic) {
      return res.status(400).json({ success: false, message: 'Language, category, level, and topic are required' });
    }

    const entries = await Lexicon.find({ language, category, level, topic });
    if (entries.length < 4) {
      return res.status(400).json({ success: false, message: 'Not enough entries to generate a quiz' });
    }

    // Generate 10 quiz questions randomly from entries
    const questions = [];
    const numQuestions = Math.min(10, entries.length * 2); // allowing multiple questions per entry if needed, but primarily up to 10
    
    for (let i = 0; i < numQuestions; i++) {
        // Randomly pick an entry
        const entry = entries[Math.floor(Math.random() * entries.length)];
        const questionType = ['multiple_choice', 'true_false', 'translation'][Math.floor(Math.random() * 3)];
        
        let questionObj = {
            id: `q_${Date.now()}_${i}`,
            type: questionType,
            correctAnswer: '',
            options: [],
            explanation: entry.notes || `The correct translation for "${entry.term}" is "${entry.translation}".`
        };

        if (questionType === 'multiple_choice') {
            questionObj.question = `What is the meaning of "${entry.term}"?`;
            questionObj.correctAnswer = entry.translation;
            
            // Get 3 incorrect translations
            let distractors = entries.filter(e => e._id.toString() !== entry._id.toString()).map(e => e.translation);
            // Shuffle and pick 3
            distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            questionObj.options = [entry.translation, ...distractors].sort(() => 0.5 - Math.random());
        } else if (questionType === 'true_false') {
            const isTrue = Math.random() > 0.5;
            let targetTranslation = entry.translation;
            
            if (!isTrue) {
                const otherEntry = entries.find(e => e._id.toString() !== entry._id.toString());
                if (otherEntry) targetTranslation = otherEntry.translation;
            }
            
            questionObj.question = `True or False: "${entry.term}" translates to "${targetTranslation}".`;
            questionObj.correctAnswer = isTrue ? 'True' : 'False';
            questionObj.options = ['True', 'False'];
            if (!isTrue) {
                questionObj.explanation = `False. "${entry.term}" actually translates to "${entry.translation}".`;
            }
        } else if (questionType === 'translation') {
            questionObj.question = `Translate the following to ${language === 'fr' ? 'French' : language === 'es' ? 'Spanish' : 'English'}: "${entry.translation}"`;
            questionObj.correctAnswer = entry.term;
            // Provide multiple choice for translation
            let distractors = entries.filter(e => e._id.toString() !== entry._id.toString()).map(e => e.term);
            distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
            questionObj.options = [entry.term, ...distractors].sort(() => 0.5 - Math.random());
        }

        questions.push(questionObj);
    }

    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
