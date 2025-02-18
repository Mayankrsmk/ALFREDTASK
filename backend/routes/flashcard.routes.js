const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Flashcard = require('../models/flashcard.model');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Calculate next review date based on level
const calculateNextReview = (level) => {
  const now = new Date();
  switch (level) {
    case 0: return now; // Same day
    case 1: return new Date(now.setDate(now.getDate() + 1)); // Next day
    case 2: return new Date(now.setDate(now.getDate() + 3)); // 3 days later
    case 3: return new Date(now.setDate(now.getDate() + 7)); // 1 week later
    case 4: return new Date(now.setDate(now.getDate() + 14)); // 2 weeks later
    case 5: return new Date(now.setDate(now.getDate() + 30)); // 1 month later
    default: return new Date(now.setDate(now.getDate() + 60)); // 2 months later
  }
};

// Get all due flashcards
router.get('/due', authenticateToken, async (req, res) => {
  try {
    const dueCards = await Flashcard.find({
      userId: req.user.userId,
      nextReview: { $lte: new Date() }
    }).sort('nextReview');
    res.json(dueCards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcards' });
  }
});

// Get flashcard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalCards = await Flashcard.countDocuments({ userId: req.user.userId });
    
    const dueCards = await Flashcard.countDocuments({
      userId: req.user.userId,
      nextReview: { $lte: new Date() }
    });
    
    // Count cards with level >= 5 as mastered
    const masteredCards = await Flashcard.countDocuments({
      userId: req.user.userId,
      level: { $gte: 5 }
    });

    // Count cards reviewed today
    const completedToday = await Flashcard.countDocuments({
      userId: req.user.userId,
      'updatedAt': { $gte: today }
    });

    // Get upcoming reviews for next 7 days
    const upcoming = [];
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const nextDayEnd = new Date(nextDay);
      nextDayEnd.setHours(23, 59, 59, 999);
      
      const count = await Flashcard.countDocuments({
        userId: req.user.userId,
        nextReview: {
          $gt: nextDay,
          $lte: nextDayEnd
        }
      });
      upcoming.push(count);
    }

    res.json({
      total: totalCards,
      due: dueCards,
      mastered: masteredCards,
      completedToday,
      upcoming
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Create new flashcard
router.post('/', authenticateToken, async (req, res) => {
  try {
    const flashcard = new Flashcard({
      question: req.body.question,
      answer: req.body.answer,
      userId: req.user.userId
    });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating flashcard' });
  }
});

// Review flashcard
router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Update level based on response
    if (req.body.result === 'correct') {
      flashcard.level = Math.min(flashcard.level + 1, 6);
    } else {
      flashcard.level = Math.max(flashcard.level - 1, 0);
    }

    flashcard.nextReview = calculateNextReview(flashcard.level);
    flashcard.reviewCount += 1;
    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flashcard' });
  }
});

module.exports = router;
