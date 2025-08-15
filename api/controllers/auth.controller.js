// controllers/auth.controller.js

const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

// POST /register
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, avatar } = req.body;
    try {
        const userDoc = await User.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            avatar,
        });
        res.status(201).json(userDoc);
    } catch (e) {
        res.status(422).json({ error: e.message });
    }
};

// POST /login
const loginUser = async (req, res) => {
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
};

// GET /profile
const getProfile = async (req, res) => {
    // req.user is attached by the authenticateToken middleware
    const { id } = req.user; 
    try {
        const userDoc = await User.findById(id);
        if (userDoc) {
            res.json({
                _id: userDoc._id,
                firstName: userDoc.firstName,
                lastName: userDoc.lastName,
                email: userDoc.email,
                avatar: userDoc.avatar,
            });
        } else {
            res.status(404).json(null);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// POST /logout
const logoutUser = (req, res) => {
    res.cookie('token', '').json(true);
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
};