const express = require('express')
require('../db/mongoose')

const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middlewares/auth')
const adminAuth = require('../middlewares/adminAuth')

const router = new express.Router()

//create user: sign up
router.post('/user', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthenticationToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})
//user login
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthenticationToken()
        res.send({user, token})
    }catch (error) {
        res.status(400).send()
    }
})
//user logout
router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((tokenObject) => {
            return tokenObject.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    }catch (error) {
        res.status(500).send()
    }
})
//logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    }catch (error) {
        res.status(500).send()
    }
})
//read userList
router.get('/userlist', auth, adminAuth, async(req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})
//read user profile
router.get('/user/me', auth, (req, res) => {
    res.send(req.user)
})
//read user profile by id
router.get('/user/:id', auth, adminAuth, async(req, res) => {
    const _id = req.params.id
    
    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//update profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)         
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete Profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})
//upload avatar
const upload = multer({
    limits: {
        fileSize: 1000000
     },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'))
        }
        callback(undefined, true)
    }
})
router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try{
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    }catch (error) {
        res.status(500).send(error)
    }  
},(error, req, res, next) => {
    res.status(400).send({error: error.message})
} )
//delete avatar
router.delete('/user/me/avatar', auth, async(req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }catch(error) {
        res.status(500).send()
    }
})

module.exports = router