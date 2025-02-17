const Flashcard = require('../models/flashcard.model');

// Calculate next review date based on box number
const calculateNextReview = (box) => {
  const now = new Date();
  switch (box) {
    case 1: return new Date(now.setDate(now.getDate() + 1));  // 1 day
    case 2: return new Date(now.setDate(now.getDate() + 3));  // 3 days
    case 3: return new Date(now.setDate(now.getDate() + 7));  // 1 week
    case 4: return new Date(now.setDate(now.getDate() + 14)); // 2 weeks
    case 5: return new Date(now.setDate(now.getDate() + 30)); // 1 month
    default: return new Date(now.setDate(now.getDate() + 1));
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const flashcard = new Flashcard({
      question: req.body.question,
      answer: req.body.answer,
      nextReview: calculateNextReview(1)
    });
    const savedFlashcard = await flashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDueFlashcards = async (req, res) => {
  try {
    const dueFlashcards = await Flashcard.find({
      nextReview: { $lte: new Date() }
    });
    res.json(dueFlashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;
    
    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Update box number based on answer
    if (isCorrect) {
      flashcard.box = Math.min(flashcard.box + 1, 5);
    } else {
      flashcard.box = 1;
    }

    // Calculate next review date
    flashcard.nextReview = calculateNextReview(flashcard.box);
    
    const updatedFlashcard = await flashcard.save();
    res.json(updatedFlashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFlashcard = await Flashcard.findByIdAndDelete(id);
    if (!deletedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
