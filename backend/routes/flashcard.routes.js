const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcard.controller');

// Create a new flashcard
router.post('/', flashcardController.createFlashcard);

// Get all flashcards
router.get('/', flashcardController.getAllFlashcards);

// Get due flashcards
router.get('/due', flashcardController.getDueFlashcards);

// Update a flashcard
router.put('/:id', flashcardController.updateFlashcard);

// Delete a flashcard
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;
