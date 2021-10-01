const {Router} = require('express')
const Link = require('../models/Link')
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router()
const shortid = require('shortid')
const auth = require('../middleware/auth.middleware')


router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = shortid.generate()

        const existing = await Link.findOne({from})

        if(existing){
            return res.json({links: existing})
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to ,from, owner: req.user.userId
        })

        await link.save()

        res.status(201).json({link})

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: '[INFO] Router post error!' })
    }
})


router.get('/', auth, async (req,res) =>{
    try {
        const links = await Link.find({owner: req.user.userId})
        res.json(links)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: '[INFO] Router post error!' })
    }
})


router.get('/:id', auth, async (req,res) =>{
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: '[INFO] Router post error!' })
    }
})

module.exports = router