const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user){
        return res.status(401).json({ message: 'Authentication Failed. User not found.' })
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        return res.status(401).json({ message: 'Authentication Failed. Invalid Password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, role: user.role });
})

//Register Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token, role: user.role });
    }catch (error){
        res.status(400).json({ message: 'Registration Failed. Please Try Again.'});
    }
})

module.exports = router;