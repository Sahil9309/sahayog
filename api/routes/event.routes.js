// routes/event.routes.js

const express = require('express');
const router = express.Router();
const { 
    createEvent, 
    getAllEvents, 
    getEventById, 
    getMyEvents,
    updateEvent,
    deleteEvent,
    contributeToEvent
} = require('../controllers/event.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Public routes
router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);
router.patch('/events/:id/contribute', contributeToEvent);

// Protected routes (require authentication)
router.post('/events', authenticateToken, createEvent);
router.get('/my-events', authenticateToken, getMyEvents);
router.put('/events/:id', authenticateToken, updateEvent);
router.delete('/events/:id', authenticateToken, deleteEvent);

module.exports = router;