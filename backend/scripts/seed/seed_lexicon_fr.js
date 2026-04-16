const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Lexicon = require('../../src/models/Lexicon'); // adjust to src/models/Lexicon if necessary. Actually the schema is in backend/src/models/Lexicon.js

const seedData = [
  // Greetings (words, A1)
  { topic: 'Greetings', term: 'Bonjour', translation: 'Hello / Good morning', definition: 'A standard greeting used during the day.', isFree: true },
  { topic: 'Greetings', term: 'Bonsoir', translation: 'Good evening', definition: 'A standard greeting used after 6 PM.', isFree: true },
  { topic: 'Greetings', term: 'Salut', translation: 'Hi / Bye', definition: 'Informal greeting among friends.', isFree: true },
  { topic: 'Greetings', term: 'Au revoir', translation: 'Goodbye', definition: 'Standard formal farewell.', isFree: false },
  { topic: 'Greetings', term: 'À bientôt', translation: 'See you soon', definition: 'Used when you expect to see someone shortly.', isFree: false },
  { topic: 'Greetings', term: 'À plus tard', translation: 'See you later', definition: 'Informal, for seeing someone later in the same day.', isFree: false },
  { topic: 'Greetings', term: 'Bonne nuit', translation: 'Good night', definition: 'Said right before going to bed.', isFree: false },
  { topic: 'Greetings', term: 'Coucou', translation: 'Hey', definition: 'Very informal, often used in texts.', isFree: false },
  { topic: 'Greetings', term: 'Adieu', translation: 'Farewell', definition: 'Literally "to God", used when you might not see the person again.', isFree: false },
  { topic: 'Greetings', term: 'Enchanté', translation: 'Nice to meet you', definition: 'Used when being introduced for the first time.', isFree: false },

  // Numbers (words, A1)
  { topic: 'Numbers', term: 'Un', translation: 'One', definition: 'Number 1.', isFree: true },
  { topic: 'Numbers', term: 'Deux', translation: 'Two', definition: 'Number 2.', isFree: true },
  { topic: 'Numbers', term: 'Trois', translation: 'Three', definition: 'Number 3.', isFree: true },
  { topic: 'Numbers', term: 'Quatre', translation: 'Four', definition: 'Number 4.', isFree: false },
  { topic: 'Numbers', term: 'Cinq', translation: 'Five', definition: 'Number 5.', isFree: false },
  { topic: 'Numbers', term: 'Six', translation: 'Six', definition: 'Number 6.', isFree: false },
  { topic: 'Numbers', term: 'Sept', translation: 'Seven', definition: 'Number 7.', isFree: false },
  { topic: 'Numbers', term: 'Huit', translation: 'Eight', definition: 'Number 8.', isFree: false },
  { topic: 'Numbers', term: 'Neuf', translation: 'Nine', definition: 'Number 9.', isFree: false },
  { topic: 'Numbers', term: 'Dix', translation: 'Ten', definition: 'Number 10.', isFree: false },

  // Colours (words, A1)
  { topic: 'Colours', term: 'Rouge', translation: 'Red', definition: 'Color of blood or strawberries.', isFree: true },
  { topic: 'Colours', term: 'Bleu', translation: 'Blue', definition: 'Color of the sky on a clear day.', isFree: true },
  { topic: 'Colours', term: 'Vert', translation: 'Green', definition: 'Color of grass or leaves.', isFree: true },
  { topic: 'Colours', term: 'Jaune', translation: 'Yellow', definition: 'Color of the sun.', isFree: false },
  { topic: 'Colours', term: 'Noir', translation: 'Black', definition: 'Color of the night.', isFree: false },
  { topic: 'Colours', term: 'Blanc', translation: 'White', definition: 'Color of snow.', isFree: false },
  { topic: 'Colours', term: 'Gris', translation: 'Grey', definition: 'Mix of black and white.', isFree: false },
  { topic: 'Colours', term: 'Marron', translation: 'Brown', definition: 'Color of earth or chocolate.', isFree: false },
  { topic: 'Colours', term: 'Orange', translation: 'Orange', definition: 'Color of the fruit.', isFree: false },
  { topic: 'Colours', term: 'Rose', translation: 'Pink', definition: 'Color often associated with love.', isFree: false },

  // Family (words, A1)
  { topic: 'Family', term: 'Mère', translation: 'Mother', definition: 'Female parent.', isFree: true },
  { topic: 'Family', term: 'Père', translation: 'Father', definition: 'Male parent.', isFree: true },
  { topic: 'Family', term: 'Frère', translation: 'Brother', definition: 'Male sibling.', isFree: true },
  { topic: 'Family', term: 'Sœur', translation: 'Sister', definition: 'Female sibling.', isFree: false },
  { topic: 'Family', term: 'Fils', translation: 'Son', definition: 'Male child.', isFree: false },
  { topic: 'Family', term: 'Fille', translation: 'Daughter / Girl', definition: 'Female child.', isFree: false },
  { topic: 'Family', term: 'Grand-mère', translation: 'Grandmother', definition: 'Mother of a parent.', isFree: false },
  { topic: 'Family', term: 'Grand-père', translation: 'Grandfather', definition: 'Father of a parent.', isFree: false },
  { topic: 'Family', term: 'Oncle', translation: 'Uncle', definition: 'Brother of a parent.', isFree: false },
  { topic: 'Family', term: 'Tante', translation: 'Aunt', definition: 'Sister of a parent.', isFree: false },

  // Food and Drink (words, A1)
  { topic: 'Food and Drink', term: 'Pain', translation: 'Bread', definition: 'Staple food baked from dough.', isFree: true },
  { topic: 'Food and Drink', term: 'Eau', translation: 'Water', definition: 'Clear liquid necessary for life.', isFree: true },
  { topic: 'Food and Drink', term: 'Café', translation: 'Coffee', definition: 'Hot caffeinated drink.', isFree: true },
  { topic: 'Food and Drink', term: 'Lait', translation: 'Milk', definition: 'White liquid from cows.', isFree: false },
  { topic: 'Food and Drink', term: 'Fromage', translation: 'Cheese', definition: 'Dairy product. Very popular in France.', isFree: false },
  { topic: 'Food and Drink', term: 'Pomme', translation: 'Apple', definition: 'Common round fruit.', isFree: false },
  { topic: 'Food and Drink', term: 'Vin', translation: 'Wine', definition: 'Alcoholic drink made from grapes.', isFree: false },
  { topic: 'Food and Drink', term: 'Viande', translation: 'Meat', definition: 'Animal flesh eaten as food.', isFree: false },
  { topic: 'Food and Drink', term: 'Poisson', translation: 'Fish', definition: 'Animal that lives in water, used as food.', isFree: false },
  { topic: 'Food and Drink', term: 'Poulet', translation: 'Chicken', definition: 'Common poultry used as food.', isFree: false },

  // Body Parts (words, A1)
  { topic: 'Body Parts', term: 'Tête', translation: 'Head', definition: 'Upper part of the human body.', isFree: true },
  { topic: 'Body Parts', term: 'Main', translation: 'Hand', definition: 'Part of the arm below the wrist.', isFree: true },
  { topic: 'Body Parts', term: 'Œil', translation: 'Eye', definition: 'Organ of sight.', isFree: true },
  { topic: 'Body Parts', term: 'Bouche', translation: 'Mouth', definition: 'Opening in the face used for eating and speaking.', isFree: false },
  { topic: 'Body Parts', term: 'Nez', translation: 'Nose', definition: 'Part of the face used for smelling.', isFree: false },
  { topic: 'Body Parts', term: 'Oreille', translation: 'Ear', definition: 'Organ of hearing.', isFree: false },
  { topic: 'Body Parts', term: 'Bras', translation: 'Arm', definition: 'Upper limb of the body.', isFree: false },
  { topic: 'Body Parts', term: 'Jambe', translation: 'Leg', definition: 'Lower limb of the body.', isFree: false },
  { topic: 'Body Parts', term: 'Pied', translation: 'Foot', definition: 'Lowest part of the leg.', isFree: false },
  { topic: 'Body Parts', term: 'Cheveux', translation: 'Hair', definition: 'Thread-like strands growing on the head.', isFree: false },

  // Clothing (words, A1)
  { topic: 'Clothing', term: 'Chemise', translation: 'Shirt', definition: 'Garment for the upper body with a collar.', isFree: true },
  { topic: 'Clothing', term: 'Pantalon', translation: 'Pants / Trousers', definition: 'Garment for the lower body.', isFree: true },
  { topic: 'Clothing', term: 'Robe', translation: 'Dress', definition: 'Garment extending from the upper body down over the legs.', isFree: true },
  { topic: 'Clothing', term: 'Chaussure', translation: 'Shoe', definition: 'Footwear.', isFree: false },
  { topic: 'Clothing', term: 'Chaussette', translation: 'Sock', definition: 'Garment worn on the foot inside a shoe.', isFree: false },
  { topic: 'Clothing', term: 'Manteau', translation: 'Coat', definition: 'Outer garment worn outdoors.', isFree: false },
  { topic: 'Clothing', term: 'Chapeau', translation: 'Hat', definition: 'Head covering.', isFree: false },
  { topic: 'Clothing', term: 'Jupe', translation: 'Skirt', definition: 'Garment hanging from the waist.', isFree: false },
  { topic: 'Clothing', term: 'Pull', translation: 'Sweater', definition: 'Knitted garment for the upper body.', isFree: false },
  { topic: 'Clothing', term: 'Veste', translation: 'Jacket', definition: 'Outer garment for the upper body.', isFree: false },

  // Animals (words, A1)
  { topic: 'Animals', term: 'Chien', translation: 'Dog', definition: 'Common domesticated animal.', isFree: true },
  { topic: 'Animals', term: 'Chat', translation: 'Cat', definition: 'Small domesticated feline.', isFree: true },
  { topic: 'Animals', term: 'Oiseau', translation: 'Bird', definition: 'Animal with feathers and wings.', isFree: true },
  { topic: 'Animals', term: 'Cheval', translation: 'Horse', definition: 'Large hoofed mammal.', isFree: false },
  { topic: 'Animals', term: 'Vache', translation: 'Cow', definition: 'Large female animal kept for milk or meat.', isFree: false },
  { topic: 'Animals', term: 'Cochon', translation: 'Pig', definition: 'Farm animal used for pork.', isFree: false },
  { topic: 'Animals', term: 'Mouton', translation: 'Sheep', definition: 'Animal kept for its wool.', isFree: false },
  { topic: 'Animals', term: 'Lapin', translation: 'Rabbit', definition: 'Small mammal with long ears.', isFree: false },
  { topic: 'Animals', term: 'Souris', translation: 'Mouse', definition: 'Small rodent.', isFree: false },
  { topic: 'Animals', term: 'Poisson', translation: 'Fish', definition: 'Aquatic animal.', isFree: false },

  // Weather (words, A1)
  { topic: 'Weather', term: 'Soleil', translation: 'Sun', definition: 'The star around which the earth orbits.', isFree: true },
  { topic: 'Weather', term: 'Pluie', translation: 'Rain', definition: 'Water falling from clouds.', isFree: true },
  { topic: 'Weather', term: 'Neige', translation: 'Snow', definition: 'Frozen precipitation.', isFree: true },
  { topic: 'Weather', term: 'Vent', translation: 'Wind', definition: 'Moving air.', isFree: false },
  { topic: 'Weather', term: 'Nuage', translation: 'Cloud', definition: 'Visible mass of condensed watery vapour in the atmosphere.', isFree: false },
  { topic: 'Weather', term: 'Orage', translation: 'Thunderstorm', definition: 'Storm with thunder and lightning.', isFree: false },
  { topic: 'Weather', term: 'Chaud', translation: 'Hot', definition: 'Having a high degree of heat.', isFree: false },
  { topic: 'Weather', term: 'Froid', translation: 'Cold', definition: 'Of or at a low or relatively low temperature.', isFree: false },
  { topic: 'Weather', term: 'Brouillard', translation: 'Fog', definition: 'Thick cloud of tiny water droplets.', isFree: false },
  { topic: 'Weather', term: 'Glace', translation: 'Ice', definition: 'Frozen water.', isFree: false },

  // Transport (words, A1)
  { topic: 'Transport', term: 'Voiture', translation: 'Car', definition: 'Four-wheeled road vehicle.', isFree: true },
  { topic: 'Transport', term: 'Train', translation: 'Train', definition: 'Series of railway carriages.', isFree: true },
  { topic: 'Transport', term: 'Avion', translation: 'Airplane', definition: 'Flying vehicle with fixed wings.', isFree: true },
  { topic: 'Transport', term: 'Bus', translation: 'Bus', definition: 'Large motor vehicle carrying passengers.', isFree: false },
  { topic: 'Transport', term: 'Vélo', translation: 'Bicycle', definition: 'Two-wheeled vehicle.', isFree: false },
  { topic: 'Transport', term: 'Moto', translation: 'Motorcycle', definition: 'Two-wheeled vehicle powered by an engine.', isFree: false },
  { topic: 'Transport', term: 'Bateau', translation: 'Boat', definition: 'Vessel for transport by water.', isFree: false },
  { topic: 'Transport', term: 'Gare', translation: 'Train station', definition: 'Place where trains stop for passengers.', isFree: false },
  { topic: 'Transport', term: 'Aéroport', translation: 'Airport', definition: 'Complex of runways and buildings for air transport.', isFree: false },
  { topic: 'Transport', term: 'Billet', translation: 'Ticket', definition: 'Piece of paper giving right to travel.', isFree: false },

  // Home (words, A1)
  { topic: 'Home', term: 'Maison', translation: 'House', definition: 'Building for human habitation.', isFree: true },
  { topic: 'Home', term: 'Chambre', translation: 'Bedroom', definition: 'Room for sleeping.', isFree: true },
  { topic: 'Home', term: 'Cuisine', translation: 'Kitchen', definition: 'Room where food is prepared.', isFree: true },
  { topic: 'Home', term: 'Salle de bain', translation: 'Bathroom', definition: 'Room containing a bath or shower.', isFree: false },
  { topic: 'Home', term: 'Salon', translation: 'Living room', definition: 'Room for relaxing and socializing.', isFree: false },
  { topic: 'Home', term: 'Porte', translation: 'Door', definition: 'Hinged, sliding, or revolving barrier at the entrance.', isFree: false },
  { topic: 'Home', term: 'Fenêtre', translation: 'Window', definition: 'Opening in the wall fitted with glass.', isFree: false },
  { topic: 'Home', term: 'Lit', translation: 'Bed', definition: 'Furniture for sleeping.', isFree: false },
  { topic: 'Home', term: 'Table', translation: 'Table', definition: 'Furniture with a flat top and one or more legs.', isFree: false },
  { topic: 'Home', term: 'Chaise', translation: 'Chair', definition: 'Furniture for sitting on.', isFree: false },

  // Days and Months (words, A1)
  { topic: 'Days and Months', term: 'Lundi', translation: 'Monday', definition: 'First day of the working week.', isFree: true },
  { topic: 'Days and Months', term: 'Mardi', translation: 'Tuesday', definition: 'Second day of the week.', isFree: true },
  { topic: 'Days and Months', term: 'Jour', translation: 'Day', definition: '24 hour period.', isFree: true },
  { topic: 'Days and Months', term: 'Mois', translation: 'Month', definition: 'Each of the twelve named periods.', isFree: false },
  { topic: 'Days and Months', term: 'Année', translation: 'Year', definition: 'Period of 365 days.', isFree: false },
  { topic: 'Days and Months', term: 'Janvier', translation: 'January', definition: 'First month of the year.', isFree: false },
  { topic: 'Days and Months', term: 'Février', translation: 'February', definition: 'Second month.', isFree: false },
  { topic: 'Days and Months', term: 'Semaine', translation: 'Week', definition: 'Period of seven days.', isFree: false },
  { topic: 'Days and Months', term: 'Matin', translation: 'Morning', definition: 'Early part of the day.', isFree: false },
  { topic: 'Days and Months', term: 'Soir', translation: 'Evening', definition: 'Later part of the day.', isFree: false },

  // Common Verbs (words, A1)
  { topic: 'Common Verbs', term: 'Être', translation: 'To be', definition: 'Used to indicate identity or state.', isFree: true },
  { topic: 'Common Verbs', term: 'Avoir', translation: 'To have', definition: 'Used to indicate possession.', isFree: true },
  { topic: 'Common Verbs', term: 'Aller', translation: 'To go', definition: 'Used to indicate movement to a place.', isFree: true },
  { topic: 'Common Verbs', term: 'Faire', translation: 'To do / make', definition: 'Used for actions or creating something.', isFree: false },
  { topic: 'Common Verbs', term: 'Dire', translation: 'To say / tell', definition: 'Used for communication.', isFree: false },
  { topic: 'Common Verbs', term: 'Pouvoir', translation: 'To be able to / can', definition: 'Used to indicate ability or permission.', isFree: false },
  { topic: 'Common Verbs', term: 'Vouloir', translation: 'To want', definition: 'Used to express desire.', isFree: false },
  { topic: 'Common Verbs', term: 'Savoir', translation: 'To know (a fact)', definition: 'Used to express knowledge.', isFree: false },
  { topic: 'Common Verbs', term: 'Voir', translation: 'To see', definition: 'Used for visual perception.', isFree: false },
  { topic: 'Common Verbs', term: 'Manger', translation: 'To eat', definition: 'Used for consuming food.', isFree: false }
].map(item => ({
  ...item,
  language: 'fr',
  category: 'words',
  level: 'A1'
}));

const expressionData = [
  // Social Formulas (expressions, A1)
  { topic: 'Social Formulas', term: 'S\'il vous plaît', translation: 'Please (formal)', definition: 'Used to make a polite request.', isFree: true },
  { topic: 'Social Formulas', term: 'Merci beaucoup', translation: 'Thank you very much', definition: 'Used to express gratitude strongly.', isFree: true },
  { topic: 'Social Formulas', term: 'De rien', translation: 'You\'re welcome', definition: 'Common response to "merci".', isFree: true },
  { topic: 'Social Formulas', term: 'Je vous en prie', translation: 'You\'re welcome (formal)', definition: 'Polite formal response to "merci".', isFree: false },
  { topic: 'Social Formulas', term: 'Pardon', translation: 'Excuse me / Sorry', definition: 'Used to apologize or interrupt mildly.', isFree: false },
  { topic: 'Social Formulas', term: 'Excusez-moi', translation: 'Excuse me', definition: 'Used to get someone\'s attention or apologize.', isFree: false },
  { topic: 'Social Formulas', term: 'À tes souhaits', translation: 'Bless you', definition: 'Said after someone sneezes (informal).', isFree: false },
  { topic: 'Social Formulas', term: 'Bon appétit', translation: 'Enjoy your meal', definition: 'Said before eating.', isFree: false },
  { topic: 'Social Formulas', term: 'C\'est pas grave', translation: 'It does not matter / No big deal', definition: 'Used to dismiss an apology or minor issue.', isFree: false },
  { topic: 'Social Formulas', term: 'Comment allez-vous?', translation: 'How are you? (formal)', definition: 'Polite inquiry about someone\'s well-being.', isFree: false }
].map(item => ({
  ...item,
  language: 'fr',
  category: 'expressions',
  level: 'A1'
}));

const allData = [...seedData, ...expressionData];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/languageapp';
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing French A1 words/expressions to avoid duplicates
    await Lexicon.deleteMany({ language: 'fr', level: 'A1', category: { $in: ['words', 'expressions'] } });
    console.log('Cleared existing French A1 words and expressions');

    const result = await Lexicon.insertMany(allData);
    console.log(`Successfully seeded ${result.length} lexicon entries.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lexicon:', error);
    process.exit(1);
  }
}

seed();
