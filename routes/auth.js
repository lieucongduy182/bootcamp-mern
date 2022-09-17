const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// @router POST /api/auth/register
// @define Register User

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'invalid username or password}' })
    }

    try {
        // Check user existing
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ success: false, message: 'User have already taken' })
        }

        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save();

        // Success
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN);
        res.status(200).json({ success: true, message: 'Register successfully', token: accessToken })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' })
    }
})

// @router POST /api/auth/login
// @define Login USER

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Invalid username or password'
        })
    }
    try {
        // check user
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Incorrect username or password' })
        }

        // check password
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password' })
        }

        // All good
        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN)
        res.status(200).json({ success: true, message: 'Login successfully', token: accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router;