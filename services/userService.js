const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'MySecretString';


async function register(email, username, password) {
    const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Email is taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        username,
        hashedPassword
    });

    return;
}

async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (hasMatch == false) {
        throw new Error('Invalid email or password');
    }

    const token = createSession(user);
    return token;
}

function createSession({ _id, username, email }) {
    const payload = {
        _id,
        username,
        email
    }

    const token = jwt.sign(payload, JWT_SECRET);
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

async function getUsernameById(userId) {
    const existing = await User.findById(userId);
    return existing.username;
}

async function getEmailById(userId) {
    const existing = await User.findById(userId);
    return existing.email;
}

module.exports = {
    register,
    login,
    verifyToken,
    getUsernameById,
    getEmailById
};