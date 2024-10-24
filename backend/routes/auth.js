const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const Admin = require('../models/Admin');

const JWT_SECRET = 'KMAKHIUJEN:WPJHWOEDUHWEO#IWBEI';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body("id").isLength({ min: 10, max: 10 }).withMessage("Please enter a valid id"),
    body('password').isLength({ min: 5 }),
    body('cpassword').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Check whether the user with same email is already exists
    try {
        let user = await User.findOne({ id: req.body.id })
        if (user) {
            success = false
            return res.status(400).json({ success, error: 'Sorry a user with this id already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        const secConPass = await bcrypt.hash(req.body.cpassword, salt)
        if (secPass === secConPass) {
            user = await User.create({
                name: req.body.name,
                id: req.body.id,
                dob: req.body.dob,
                pass: secPass,
                conPass: secConPass,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true

            res.json({ success, authToken })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body("id").isLength({ min: 10, max: 10 }).withMessage("Please enter a valid id"),
    body('password').isLength({ min: 5 }).withMessage("Password cannot be blank").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { id, password } = req.body

    try {
        let user = await User.findOne({ id })
        if (!user) {
            return res.status(400).json({ error: 'Please try to login with correct Credentials' })
        }

        const passwordCompare = await bcrypt.compare(password, user.pass)

        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: 'Please try to login with correct Credentials' })
        }

        const data = {
            user: {
                id: user.id,
                upVote: user.upVote
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 3: Get loggedin User details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userVote = req.user.upVote
        let user = await User.findById(userVote).select('-password')
        res.send(user)
        res.json({ userVote })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 4: Create a Admin using: POST "/api/auth/createadmin". No login required
router.post('/createadmin', [
    body('name').isLength({ min: 3 }),
    body("id").isLength({ min: 10, max: 10 }).withMessage("Please enter a valid id"),
    body('pass').isLength({ min: 5 }),
    body('conPass').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Check whether the user with same email is already exists
    try {
        let user = await Admin.findOne({ id: req.body.id })
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with this id already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.pass, salt)
        const secConPass = await bcrypt.hash(req.body.conPass, salt)
        if (secPass === secConPass) {
            user = await Admin.create({
                name: req.body.name,
                id: req.body.id,
                dob: req.body.dob,
                pass: secPass,
                conPass: secConPass
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            
            res.json({ authToken })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 5: Authenticate a Admin using: POST "/api/auth/admin-login". No login required
router.post('/admin-login', [
    body("id").isLength({ min: 10, max: 10 }).withMessage("Please enter a valid id"),
    body('password').isLength({ min: 5 }).withMessage("Password cannot be blank").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { id, password } = req.body

    try {
        let user = await Admin.findOne({ id })
        if (!user) {
            return res.status(400).json({ error: 'Please try to login with correct Credentials' })
        }

        const passwordCompare = await bcrypt.compare(password, user.pass)

        if (!passwordCompare) {
            success = false
            return res.status(400).json({ error: 'Please try to login with correct Credentials' })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router