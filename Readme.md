# Flashcard Learning App

A modern spaced repetition flashcard application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users learn effectively through active recall and spaced repetition.

## Features

### Core Functionality
- **Spaced Repetition System**: Implements an intelligent review schedule based on user performance
- **Active Recall**: Users actively engage with the material through self-testing
- **Progress Tracking**: Detailed statistics about learning progress and mastery
- **Dark Mode**: Eye-friendly dark theme for comfortable studying at night

### User System
- **Authentication**: Secure JWT-based authentication system
- **Personal Decks**: Each user has their own set of flashcards
- **Progress Persistence**: Learning progress is saved and maintained across sessions

### Learning Algorithm
The app uses a 7-level spaced repetition system:
- Level 0: Review same day
- Level 1: Review next day
- Level 2: Review after 3 days
- Level 3: Review after 1 week
- Level 4: Review after 2 weeks
- Level 5: Review after 1 month
- Level 6: Review after 2 months

Cards move up a level when answered correctly and down when answered incorrectly.

## Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Context API for state management
- Axios for API requests
- CSS Variables for theming
- Inter font family for modern typography

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:


## Design Decisions

### Authentication
- JWT-based authentication for stateless, secure user sessions
- Token stored in localStorage for persistence
- Protected routes using React Router

### UI/UX
- Minimalist design focusing on content
- Consistent spacing and typography
- Smooth transitions and animations
- Dark mode support for better user experience
- Responsive design for all screen sizes

### State Management
- React Context for global state (auth, theme)
- Local state for component-specific data
- Axios interceptors for handling auth tokens

### Database Schema
- User model with hashed passwords
- Flashcard model with spaced repetition metadata
- Relationships maintained through userId references

