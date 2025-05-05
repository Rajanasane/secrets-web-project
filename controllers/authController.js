const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(400).send("Error during registration: " + error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = user.generateAuthToken();
        res.cookie('auth_token', token, { httpOnly: true, secure: true });
        res.redirect('/secret');
    } catch (error) {
        res.status(400).send('Login error: ' + error.message);
    }
};

exports.secretPage = (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.render('secret');
    } catch (err) {
        return res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/login');
};
