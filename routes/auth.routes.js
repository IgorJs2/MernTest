const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const { use } = require('express/lib/router')
const { get } = require('mongoose')
const router = Router()

// /api/auth/register
router.post('/register', [check('email', '[INFO] Incorrect email!').isEmail(),
  check('password', '[INFO] Incorrect password!').isLength({ min: 6 }),
  check('login', '[INFO] Incorrect login!').isLength({ min: 10 }),
  check('role', '[INFO] Choose role!')],

async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: '[INFO] Incorrect data in registration!'
      })
    }

    const { email, password, login, role } = req.body

    const loginCheck = await User.findOne({ login })
    const emailCheck = await User.findOne({ email })
    if (emailCheck || loginCheck) {
      return res.status(400).json({ message: '[INFO] Person duplicates!' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword, login, role })

    await user.save()

    res.status(201).json({ message: '[INFO] User created!' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: '[INFO] Router post error!' })
  }
})

// /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, login } = req.body

    const user = await User.findOne({ email, login })

    if (!user) {
      return res.status(400).json({ message: '[INFO] User not found!' })
    }

    const isMatchPassword = await bcrypt.compare(password, user.password)

    if (!isMatchPassword) {
      return res.status(400).json({ message: '[INFO] Incorrect password please try again!' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '10h' }
    )
    console.log(token)

    res.json({ token, userId: user.id })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: '[INFO] Router post error1!1' })
  }
})

module.exports = router
