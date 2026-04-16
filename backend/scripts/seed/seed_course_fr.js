const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const LearningPath = require('../../src/models/LearningPath');
const Chapter = require('../../src/models/Chapter');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/languageapp';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clean up existing French paths and their chapters
    const existingPaths = await LearningPath.find({ language: 'fr' });
    const pathIds = existingPaths.map(p => p._id);
    await Chapter.deleteMany({ pathId: { $in: pathIds } });
    await LearningPath.deleteMany({ language: 'fr' });
    console.log('Cleared existing French paths and chapters');

    // 1. Create Survival Path
    const survivalPath = await LearningPath.create({
      language: 'fr',
      level: 'survival',
      order: 1,
      title: 'Survival Path',
      description: 'Master the absolute basics for traveling and surviving in a new language.',
      isLocked: false
    });

    const confidencePath = await LearningPath.create({
      language: 'fr',
      level: 'confidence',
      order: 2,
      title: 'Confidence Builder',
      description: 'Expand your vocabulary to express opinions and connect with locals.',
      isLocked: true,
      prerequisitePathId: survivalPath._id
    });

    console.log('Created core learning paths');

    const chapters = [
      {
        pathId: survivalPath._id,
        order: 1,
        title: 'Introducing Yourself',
        topic: 'Basics',
        tabs: {
          read: {
            passage: 'Marie est arrivée à Paris ce matin. Elle va au café. Elle dit bonjour et se présente au serveur.',
            vocabulary: [
              { word: 'arrivé', definition: 'arrived' },
              { word: 'matin', definition: 'morning' }
            ],
            comprehensionQuestions: [
              { question: 'Where did Marie arrive?', options: ['London', 'Paris', 'Lyon'], correctAnswer: 'Paris', explanation: 'The passage says "Marie est arrivée à Paris".' }
            ]
          },
          listen: {
            audioUrl: 'https://example.com/audio/fr_survival_1.mp3',
            transcript: 'Bonjour, je m\'appelle Marie. Et vous, comment vous appelez-vous ?',
            mode: 'dialogue'
          },
          speak: {
            dialogue: [
              { speaker: 'Marie', target: 'Bonjour !', translation: 'Hello!', phonetics: '/bɔ̃.ʒuʁ/' },
              { speaker: 'Serveur', target: 'Bonjour, madame.', translation: 'Hello, madam.', phonetics: '/bɔ̃.ʒuʁ ma.dam/' },
              { speaker: 'Marie', target: 'Je m\'appelle Marie.', translation: 'My name is Marie.', phonetics: '/ʒə ma.pɛl ma.ʁi/' },
              { speaker: 'Serveur', target: 'Enchanté Marie, je suis Pierre.', translation: 'Nice to meet you Marie, I am Pierre.', phonetics: '/ɑ̃.ʃɑ̃.te ma.ʁi, ʒə sɥi pjɛʁ/' },
              { speaker: 'Marie', target: 'Enchantée. Un café, s\'il vous plaît.', translation: 'Nice to meet you (too). A coffee, please.', phonetics: '/ɑ̃.ʃɑ̃.te. œ̃ ka.fe, sil vu plɛ/' },
              { speaker: 'Serveur', target: 'Tout de suite, madame.', translation: 'Right away, madam.', phonetics: '/tu də sɥit, ma.dam/' }
            ],
            keyPhrases: [
              { phrase: 'Je m\'appelle...', phonetics: '/ʒə ma.pɛl/', translation: 'My name is...' },
              { phrase: 'Comment vous appelez-vous ?', phonetics: '/kɔ.mɑ̃ vu.za.ple.vu/', translation: 'What is your name? (formal)' },
              { phrase: 'Enchanté(e)', phonetics: '/ɑ̃.ʃɑ̃.te/', translation: 'Nice to meet you' },
              { phrase: 'Et vous ?', phonetics: '/e vu/', translation: 'And you?' },
              { phrase: 'Je suis...', phonetics: '/ʒə sɥi/', translation: 'I am...' }
            ],
            commonMistakes: [
              { mistake: 'Je suis nom est...', correction: 'Je m\'appelle...', explanation: 'Do not literally translate "My name is". Use the reflexive verb s\'appeler.' },
              { mistake: 'Pronouncing the t in "comment"', correction: 'Drop the final t', explanation: 'Final consonants are usually silent in French.' },
              { mistake: 'Forgetting the gender on Enchanté', correction: 'Add an e for females: Enchantée', explanation: 'French adjectives match the gender of the speaker here.' }
            ],
            culturalNote: 'In France, it is polite to always say "Bonjour" when entering a shop or café before saying anything else.',
            rolePlayPrompt: 'You walk into a café and want to order a coffee, but first introduce yourself to the friendly owner.',
            rolePlayModelAnswer: 'Bonjour ! Je m\'appelle [Your Name]. Un café, s\'il vous plaît.'
          },
          write: {
            task: 'Construct a sentence to introduce yourself formally.',
            exampleResponse: 'Bonjour, je m\'appelle Thomas.',
            options: [
              { prompt: 'Translate: Hello, my name is...', correctAnswer: 'Bonjour, je m\'appelle...', distractors: ['Salut, mon nom...', 'Bonjour, j\'ai...'] }
            ]
          }
        },
        quizQuestions: [
          { question: 'How do you say "My name is"?', type: 'multiple_choice', options: ['Je suis nom est', 'Je m\'appelle', 'Je me nomme'], correctAnswer: 'Je m\'appelle', explanation: 'Je m\'appelle is the standard phrasing.' },
          { question: 'True or False: You should pronounce the last "t" in "Comment".', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Final consonants are typically silent.' },
          { question: 'What is the polite way to ask for something?', type: 'multiple_choice', options: ['Je veux ça', 'Donne moi', 'S\'il vous plaît'], correctAnswer: 'S\'il vous plaît', explanation: 'Always use S\'il vous plaît.' },
          { question: 'Translate to French: Hello!', type: 'translation', options: ['Bonjour', 'Au revoir', 'Merci'], correctAnswer: 'Bonjour', explanation: 'Basic greeting.' },
          { question: 'How would a female say "Nice to meet you"?', type: 'multiple_choice', options: ['Enchanté', 'Enchantée', 'Bonsoir'], correctAnswer: 'Enchantée', explanation: 'Add an extra e for feminine form.' }
        ]
      },
      {
        pathId: survivalPath._id,
        order: 2,
        title: 'Greetings',
        topic: 'Social',
        tabs: {
          read: {
            passage: 'En France, il est important de dire bonjour. Le matin on dit "Bonjour", le soir on dit "Bonsoir".',
            vocabulary: [],
            comprehensionQuestions: []
          },
          listen: { audioUrl: '', transcript: 'Bonjour madame, comment allez-vous?', mode: 'monologue' },
          speak: {
            dialogue: [
              { speaker: 'A', target: 'Bonjour!', translation: 'Hello!', phonetics: '/bɔ̃.ʒuʁ/' },
              { speaker: 'B', target: 'Bonjour, comment allez-vous ?', translation: 'Hello, how are you?', phonetics: '/...' },
              { speaker: 'A', target: 'Je vais bien, merci. Et vous ?', translation: 'I am fine, thank you. And you?', phonetics: '/...' },
              { speaker: 'B', target: 'Très bien, merci.', translation: 'Very well, thanks.', phonetics: '/.../' },
              { speaker: 'A', target: 'Au revoir!', translation: 'Goodbye!', phonetics: '/o ʁə.vwaʁ/' },
              { speaker: 'B', target: 'Bonne journée!', translation: 'Have a good day!', phonetics: '/bɔn ʒuʁ.ne/' }
            ],
            keyPhrases: [
              { phrase: 'Comment allez-vous?', phonetics: '/.../', translation: 'How are you? (formal)' },
              { phrase: 'Je vais bien', phonetics: '/.../', translation: 'I am doing well' },
              { phrase: 'Bonne journée', phonetics: '/.../', translation: 'Have a good day' },
              { phrase: 'Bonsoir', phonetics: '/bɔ̃.swaʁ/', translation: 'Good evening' },
              { phrase: 'À demain', phonetics: '/a də.mɛ̃/', translation: 'See you tomorrow' }
            ],
            commonMistakes: [
              { mistake: 'Saying "Bonjour" at night', correction: 'Use "Bonsoir" after 6pm', explanation: 'Bonjour is only for daylight hours.' },
              { mistake: 'Using "Tu" with strangers', correction: 'Use "Vous"', explanation: 'Vous shows respect.' },
              { mistake: 'Saying "Je suis bien"', correction: 'Say "Je vais bien"', explanation: 'State of being is expressed with "aller" (to go), not "être" (to be).' }
            ],
            culturalNote: 'La bise (the cheek kiss) is a common informal greeting in France among friends.',
            rolePlayPrompt: 'Greet your boss in the morning and ask how they are.',
            rolePlayModelAnswer: 'Bonjour ! Comment allez-vous ?'
          },
          write: { task: 'Write a formal greeting.', exampleResponse: 'Bonjour monsieur, comment allez-vous?', options: [] }
        },
        quizQuestions: [
          { question: 'What to say after 6pm?', type: 'multiple_choice', options: ['Bonjour', 'Bonsoir', 'Bonne nuit'], correctAnswer: 'Bonsoir', explanation: '' },
          { question: 'Meaning of Bonne journée?', type: 'multiple_choice', options: ['Good morning', 'Have a good day', 'Good night'], correctAnswer: 'Have a good day', explanation: '' },
          { question: 'How do you say "I am doing well"?', type: 'multiple_choice', options: ['Je suis bien', 'Je vais bien', 'J\'ai bien'], correctAnswer: 'Je vais bien', explanation: '' },
          { question: 'Translate: See you tomorrow', type: 'translation', options: ['À demain', 'Au revoir', 'À bientôt'], correctAnswer: 'À demain', explanation: '' },
          { question: 'True or False: Use "Tu" with the waiter.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Use Vous.' }
        ]
      },
      {
        pathId: survivalPath._id,
        order: 3,
        title: 'Numbers and Dates',
        topic: 'Essentials',
        tabs: {
          read: { passage: 'Nous sommes le 14 Juillet. C\'est la fête nationale.', vocabulary: [], comprehensionQuestions: [] },
          listen: { audioUrl: '', transcript: 'Mon numéro est le zéro six, douze, trente-quatre.', mode: 'monologue' },
          speak: {
            dialogue: [
              { speaker: 'Receptionist', target: 'Bonjour, pour quelle date ?', translation: 'Hello, for what date?', phonetics: '/.../' },
              { speaker: 'Guest', target: 'Pour le cinq mai.', translation: 'For the 5th of May.', phonetics: '/.../' },
              { speaker: 'Receptionist', target: 'Combien de personnes ?', translation: 'How many people?', phonetics: '/.../' },
              { speaker: 'Guest', target: 'Deux personnes.', translation: 'Two people.', phonetics: '/.../' },
              { speaker: 'Receptionist', target: 'Votre numéro de téléphone ?', translation: 'Your phone number?', phonetics: '/.../' },
              { speaker: 'Guest', target: 'C\'est le zéro six...', translation: 'It is zero six...', phonetics: '/.../' }
            ],
            keyPhrases: [
              { phrase: 'Quel jour sommes-nous ?', phonetics: '/', translation: 'What day is it?' },
              { phrase: 'Le premier...', phonetics: '/', translation: 'The first of...' },
              { phrase: 'Combien ça coûte ?', phonetics: '/', translation: 'How much does it cost?' },
              { phrase: 'C\'est combien ?', phonetics: '/', translation: 'How much is it?' },
              { phrase: 'Zéro', phonetics: '/', translation: 'Zero' }
            ],
            commonMistakes: [
              { mistake: 'Saying "Un mai"', correction: 'Say "Le premier mai"', explanation: 'The first of the month always uses "premier".' },
              { mistake: 'Reading phone numbers digit by digit', correction: 'Group by two', explanation: 'French numbers are read in pairs.' },
              { mistake: 'Omitting "le" in dates', correction: 'Always use "le"', explanation: 'Dates require the definite article.' }
            ],
            culturalNote: 'Dates are written DD/MM/YYYY in France.',
            rolePlayPrompt: 'Tell the receptionist your reservation is for two people on the first of June.',
            rolePlayModelAnswer: 'C\'est pour deux personnes le premier juin.'
          },
          write: { task: 'Write a date.', exampleResponse: 'Le 14 Janvier', options: [] }
        },
        quizQuestions: [
          { question: 'Number 5 in French?', type: 'multiple_choice', options: ['Cinq', 'Quatre', 'Six'], correctAnswer: 'Cinq', explanation: '' },
          { question: 'First of May?', type: 'multiple_choice', options: ['Un mai', 'Premier mai', 'Le premier mai'], correctAnswer: 'Le premier mai', explanation: '' },
          { question: 'How are phone numbers usually grouped?', type: 'multiple_choice', options: ['By 1s', 'By 2s', 'By 3s'], correctAnswer: 'By 2s', explanation: '' },
          { question: 'Translate: How much is it?', type: 'translation', options: ['C\'est combien ?', 'Combien de ?', 'Quand ?'], correctAnswer: 'C\'est combien ?', explanation: '' },
          { question: 'Format for French dates?', type: 'multiple_choice', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'], correctAnswer: 'DD/MM/YYYY', explanation: '' }
        ]
      },
      {
        pathId: survivalPath._id,
        order: 4,
        title: 'Food and Ordering',
        topic: 'Dining',
        tabs: {
          read: { passage: 'Dans un restaurant, on demande le menu et l\'addition.', vocabulary: [], comprehensionQuestions: [] },
          listen: { audioUrl: '', transcript: 'Je voudrais commander, s\'il vous plaît.', mode: 'dialogue' },
          speak: {
            dialogue: [
              { speaker: 'Waiter', target: 'Vous avez choisi ?', translation: 'Have you chosen?', phonetics: '/.../' },
              { speaker: 'Client', target: 'Oui, je voudrais le poulet, s\'il vous plaît.', translation: 'Yes, I would like the chicken, please.', phonetics: '/.../' },
              { speaker: 'Waiter', target: 'Et comme boisson ?', translation: 'And to drink?', phonetics: '/.../' },
              { speaker: 'Client', target: 'Une carafe d\'eau.', translation: 'A jug of tap water.', phonetics: '/.../' },
              { speaker: 'Waiter', target: 'Très bien.', translation: 'Very good.', phonetics: '/.../' },
              { speaker: 'Client', target: 'L\'addition, s\'il vous plaît.', translation: 'The bill, please.', phonetics: '/.../' }
            ],
            keyPhrases: [
              { phrase: 'Je voudrais...', phonetics: '/', translation: 'I would like...' },
              { phrase: 'Une table pour deux', phonetics: '/', translation: 'A table for two' },
              { phrase: 'L\'addition', phonetics: '/', translation: 'The bill' },
              { phrase: 'Une carafe d\'eau', phonetics: '/', translation: 'Tap water' },
              { phrase: 'C\'est délicieux', phonetics: '/', translation: 'It\'s delicious' }
            ],
            commonMistakes: [
              { mistake: 'Ordering "de l\'eau"', correction: 'Order "une carafe d\'eau"', explanation: 'To get free tap water, specifically ask for a carafe.' },
              { mistake: 'Using "Je veux" (I want)', correction: 'Use "Je voudrais"', explanation: 'Je veux is too direct and impolite.' },
              { mistake: 'Tipping automatically', correction: 'Service is included', explanation: 'Tipping extra is optional.' }
            ],
            culturalNote: 'Service is included in the price in France.',
            rolePlayPrompt: 'Order a coffee and ask for the bill.',
            rolePlayModelAnswer: 'Je voudrais un café. L\'addition s\'il vous plaît.'
          },
          write: { task: 'Write an order.', exampleResponse: 'Je voudrais un dessert.', options: [] }
        },
        quizQuestions: [
          { question: 'Polite way to say "I want"?', type: 'multiple_choice', options: ['Je veux', 'Je voudrais', 'Donnez-moi'], correctAnswer: 'Je voudrais', explanation: '' },
          { question: 'How to ask for tap water?', type: 'multiple_choice', options: ['Une eau', 'Une carafe d\'eau', 'De l\'eau s\'il vous plaît'], correctAnswer: 'Une carafe d\'eau', explanation: '' },
          { question: 'How to ask for the bill?', type: 'multiple_choice', options: ['L\'addition', 'La note', 'Le billet'], correctAnswer: 'L\'addition', explanation: '' },
          { question: 'True or False: You must always leave a 20% tip in France.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: '' },
          { question: 'Translate "Have you chosen?"', type: 'translation', options: ['Vous avez choisi ?', 'Vous voulez ?', 'Quoi ?'], correctAnswer: 'Vous avez choisi ?', explanation: '' }
        ]
      },
      {
        pathId: survivalPath._id,
        order: 5,
        title: 'Asking for Help',
        topic: 'Travel',
        tabs: {
          read: { passage: 'Si vous êtes perdu, demandez de l\'aide. "Pardon, où sont les toilettes ?"', vocabulary: [], comprehensionQuestions: [] },
          listen: { audioUrl: '', transcript: 'Excusez-moi, parlez-vous anglais ?', mode: 'dialogue' },
          speak: {
            dialogue: [
              { speaker: 'Tourist', target: 'Pardon, madame.', translation: 'Excuse me, madam.', phonetics: '/.../' },
              { speaker: 'Local', target: 'Oui ?', translation: 'Yes?', phonetics: '/.../' },
              { speaker: 'Tourist', target: 'Je suis perdu. Où est la gare ?', translation: 'I am lost. Where is the train station?', phonetics: '/.../' },
              { speaker: 'Local', target: 'C\'est tout droit.', translation: 'It is straight ahead.', phonetics: '/.../' },
              { speaker: 'Tourist', target: 'Pouvez-vous répéter ?', translation: 'Can you repeat?', phonetics: '/.../' },
              { speaker: 'Local', target: 'Tout droit !', translation: 'Straight ahead!', phonetics: '/.../' }
            ],
            keyPhrases: [
              { phrase: 'Où est...', phonetics: '/', translation: 'Where is...' },
              { phrase: 'Je suis perdu(e)', phonetics: '/', translation: 'I am lost' },
              { phrase: 'Je ne comprends pas', phonetics: '/', translation: 'I don\'t understand' },
              { phrase: 'Parlez-vous anglais ?', phonetics: '/', translation: 'Do you speak English?' },
              { phrase: 'Pouvez-vous répéter ?', phonetics: '/', translation: 'Can you repeat?' }
            ],
            commonMistakes: [
              { mistake: 'Asking abruptly', correction: 'Always start with "Pardon" or "Excusez-moi"', explanation: 'Directness is considered rude.' },
              { mistake: 'Pronouncing the t in "est"', correction: 'Say "eh"', explanation: 'Où est is pronounced "oo eh".' },
              { mistake: 'Using Tu for help', correction: 'Use Vous', explanation: 'Asking strangers requires Vous.' }
            ],
            culturalNote: 'Locals are more likely to help if you attempt to speak French before asking to switch to English.',
            rolePlayPrompt: 'You are lost. Ask a stranger if they speak English.',
            rolePlayModelAnswer: 'Pardon, parlez-vous anglais ?'
          },
          write: { task: 'Write a request for help.', exampleResponse: 'Où est l\'hôpital ?', options: [] }
        },
        quizQuestions: [
          { question: 'How to say "Where is"?', type: 'multiple_choice', options: ['Où est', 'Quand est', 'Comment est'], correctAnswer: 'Où est', explanation: '' },
          { question: 'How to say "I don\'t understand"?', type: 'multiple_choice', options: ['Je ne sais pas', 'Je ne comprends pas', 'Je ne parle pas'], correctAnswer: 'Je ne comprends pas', explanation: '' },
          { question: 'Best way to ask someone to repeat?', type: 'multiple_choice', options: ['Quoi ?', 'Pouvez-vous répéter ?', 'Répète'], correctAnswer: 'Pouvez-vous répéter ?', explanation: '' },
          { question: 'True or False: Always start a request to a stranger with "Pardon" or "Excusez-moi".', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: '' },
          { question: 'How to ask if someone speaks English?', type: 'translation', options: ['Parlez-vous anglais ?', 'Parles anglais ?', 'Est-ce que anglais ?'], correctAnswer: 'Parlez-vous anglais ?', explanation: '' }
        ]
      }
    ];

    await Chapter.insertMany(chapters);
    console.log(`Successfully inserted ${chapters.length} chapters.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding learning paths:', error);
    process.exit(1);
  }
}

seed();
