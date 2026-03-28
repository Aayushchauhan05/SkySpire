const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, required: true },
  duration: { type: String, required: true },
  color: { type: String, required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'Not Started' },
});

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);
