// controllers/event.controller.js

const Event = require('../models/Event.js');

// POST /events
const createEvent = async (req, res) => {
    try {
        const { title, description, amountToRaise, imageUrl } = req.body;
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

        const eventData = {
            title,
            description,
            amountToRaise,
            tags,
            imageUrl,
            createdBy: req.user.id,
        };

        if (req.file) {
            // The path to the uploaded file is provided by the 'multer' middleware
            eventData.uploadedImage = req.file.path;
        }

        const eventDoc = await Event.create(eventData);
        await eventDoc.populate('createdBy', 'firstName lastName email avatar');
        res.status(201).json(eventDoc);
    } catch (e) {
        console.error('EVENT CREATION FAILED:', e); // Log the full error on the server

        // Provide specific feedback for Mongoose validation errors
        if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(val => val.message);
            return res.status(422).json({ error: `Validation Error: ${messages.join(', ')}` });
        }
        // Handle bad JSON in the 'tags' field
        if (e instanceof SyntaxError) {
           return res.status(422).json({ error: "Invalid format for tags." });
        }
        
        res.status(422).json({ error: e.message });
    }
};

// ... (the rest of the controller functions remain the same)

// GET /events
const getAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, tags, isActive = true } = req.query;
        const query = { isActive: isActive === 'true' };
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }
        const events = await Event.find(query)
            .populate('createdBy', 'firstName lastName email avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Event.countDocuments(query);
        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /events/:id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName email avatar');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /my-events
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id }).populate('createdBy', 'firstName lastName email avatar').sort({ createdAt: -1 });
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /events/:id
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true }).populate('createdBy', 'firstName lastName email avatar');
        res.json(updatedEvent);
    } catch (e) {
        res.status(422).json({ error: e.message });
    }
};

// DELETE /events/:id
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }
        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PATCH /events/:id/contribute
const contributeToEvent = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid contribution amount' });
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        event.currentAmount += Number(amount);
        await event.save();
        res.json({
            message: 'Donation recorded successfully',
            currentAmount: event.currentAmount,
            progress: (event.currentAmount / event.amountToRaise) * 100
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    getMyEvents,
    updateEvent,
    deleteEvent,
    contributeToEvent,
};