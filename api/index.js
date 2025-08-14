const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Event = require('./models/Event.js');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    throw new Error('MONGO_URI environment variable is not defined');
}
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) return reject(err);
            resolve(userData);
        });
    });
}

app.get('/api/test', (req, res) => {
    res.json('test ok');
});

// User Routes
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password, avatar } = req.body;
    try {
        const userDoc = await User.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            avatar, // Add avatar (will be null/undefined if not provided)
        });
        res.status(201).json(userDoc);
    } catch (e) {
        res.status(422).json({ error: e.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('Password not correct');
        }
    } else {
        res.status(404).json('User not found');
    }
});

app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

// Event Routes

// Create a new event (authenticated route)
app.post('/api/events', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const { title, description, amountToRaise, tags, uploadedImage, imageUrl } = req.body;

        const eventDoc = await Event.create({
            title,
            description,
            amountToRaise,
            tags,
            uploadedImage,
            imageUrl,
            createdBy: userData.id,
        });

        // Populate the createdBy field with user data
        await eventDoc.populate('createdBy', 'firstName lastName email avatar');
        res.status(201).json(eventDoc);
    } catch (e) {
        res.status(422).json({ error: e.message });
    }
});

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const { page = 1, limit = 10, tags, isActive = true } = req.query;
        
        // Build query object
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
            currentPage: page,
            total
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get specific event by ID
app.get('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id)
            .populate('createdBy', 'firstName lastName email avatar');
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update event (authenticated route - only creator can update)
app.put('/api/events/:id', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const { id } = req.params;
        const { title, description, amountToRaise, tags, uploadedImage, imageUrl, isActive } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is the creator of the event
        if (event.createdBy.toString() !== userData.id) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, {
            title,
            description,
            amountToRaise,
            tags,
            uploadedImage,
            imageUrl,
            isActive,
        }, { new: true }).populate('createdBy', 'firstName lastName email avatar');

        res.json(updatedEvent);
    } catch (e) {
        res.status(422).json({ error: e.message });
    }
});

// Delete event (authenticated route - only creator can delete)
app.delete('/api/events/:id', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is the creator of the event
        if (event.createdBy.toString() !== userData.id) {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }

        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get events created by authenticated user
app.get('/api/my-events', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const events = await Event.find({ createdBy: userData.id })
            .populate('createdBy', 'firstName lastName email avatar')
            .sort({ createdAt: -1 });

        res.json(events);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update current amount raised for an event (to contribute)
app.patch('/api/events/:id/contribute', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid Contribution amount' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.currentAmount += amount;
        await event.save();

        res.json({ 
            message: 'Donation recorded successfully',
            currentAmount: event.currentAmount,
            progress: (event.currentAmount / event.amountToRaise) * 100
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const port = 4000;

app.listen(port, () => {
    console.log(`Server is listening at port no ${port} 🚀`);
});