const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TrainingModule = require('./models/TrainingModule');
const LearningPath = require('./models/LearningPath');
const Chapter = require('./models/Chapter');
const Quiz = require('./models/Quiz');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected to seed data...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const trainingModules = [
  {
    title: 'Grammar Fundamentals',
    desc: 'Master basic sentence structures and verb conjugations.',
    icon: 'book-outline',
    duration: '15 mins',
    status: 'In Progress',
    progress: 0.6,
    color: '#FF8A66',
  },
  {
    title: 'Essential Vocabulary',
    desc: 'Top 500 words for daily communication.',
    icon: 'chatbubble-ellipses-outline',
    duration: '10 mins',
    status: 'Not Started',
    progress: 0,
    color: '#9B8AF4',
  },
  {
    title: 'Listening Skills',
    desc: 'Understand native speakers in real-world scenarios.',
    icon: 'headset-outline',
    duration: '12 mins',
    status: 'Completed',
    progress: 1,
    color: '#FFB800',
  },
  {
    title: 'Speaking Proficiency',
    desc: 'Practice pronunciation and common phrases.',
    icon: 'mic-outline',
    duration: '8 mins',
    status: 'Review Required',
    progress: 0.3,
    color: '#FF5C7A',
  },
];

const learningPaths = [
  {
    id: 'SURVIVAL',
    title: 'Survival Path',
    color: '#9B8AF4',
    lessons: ['Basics of Greetings', 'Asking for Directions', 'Check-in at Hotel', 'Basic Feelings'],
  },
  {
    id: 'CONFIDENCE',
    title: 'Confidence Builder',
    color: '#FF8A66',
    lessons: ['Expressing Opinions', 'Work Meetings', 'Family Traditions', 'Past Holidays'],
  },
  {
    id: 'FLUENCY',
    title: 'Fluency Track',
    color: '#FFB800',
    lessons: ['Complex Issues', 'Technical Terms', 'Native Jokes', 'Debating News'],
  },
  {
    id: 'MASTERY',
    title: 'Mastery Circle',
    color: '#FF5C7A',
    lessons: ['Abstract Concepts', 'Classical Literature', 'Political Speech', 'Poetry'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await TrainingModule.deleteMany();
    await LearningPath.deleteMany();
    await Chapter.deleteMany();
    await Quiz.deleteMany();

    await TrainingModule.insertMany(trainingModules);
    await LearningPath.insertMany(learningPaths);

    // Create a dummy quiz
    const quiz = await Quiz.create({
      id: 'spanish-basics-quiz',
      title: 'Chapter Quiz',
      questions: [
        {
          id: 1,
          question: "How do you say 'Good Morning' in Spanish?",
          options: ["Hola", "Buenos Días", "Buenas Noches", "Adiós"],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: "Which of these is informal?",
          options: ["¿Cómo está usted?", "Hola, ¿qué tal?", "Mucho gusto", "Encantado"],
          correctAnswer: 1,
        },
      ],
    });

    // Create a dummy chapter
    await Chapter.create({
      id: 'Basics of Greetings',
      pathId: 'SURVIVAL',
      title: 'Basics of Greetings',
      videoTitle: 'Introduction to Greetings',
      videoDuration: '5:24',
      lectures: [
        { id: 1, title: 'Introduction to Greetings', duration: '5:24', completed: true },
        { id: 2, title: 'Formal vs Informal', duration: '8:12', completed: false },
        { id: 3, title: 'Common Mistakes', duration: '4:45', completed: false },
        { id: 4, title: 'Practice Exercise', duration: '10:00', completed: false },
      ],
      studyNote: {
        tag: 'STUDY NOTE',
        title: "The Difference between 'Hola' and 'Buenos Días'",
        body: "While 'Hola' is used at any time of day for informal greetings, 'Buenos Días' is specifically used in the morning until midday.",
      },
      quizId: quiz._id,
    });

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
