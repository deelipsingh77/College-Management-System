const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Authentication Failed. User not found.' })
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Authentication Failed. Invalid Password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ token, role: user.role, name: user.name });
})

//Register Route
router.post('/register', async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { name, username, password, role } = req.body;

        try {
            const user = new User({ name, username, password, role });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            res.json({ token, role: user.role, name: user.name });
        } catch (error) {
            res.status(400).json({ message: 'Registration Failed. Please Try Again.', code: error.code });
        }
    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Server Error'})
    }
})

module.exports = router;