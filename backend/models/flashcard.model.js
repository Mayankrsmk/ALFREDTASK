const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  box: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it required if you implement user authentication
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
