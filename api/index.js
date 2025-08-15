// index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

// Connect to Database
connectDB();

// Core Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

// Test Route
app.get('/api/test', (req, res) => {
    res.json('test ok');
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is listening at port no ${port} 🚀`);
});