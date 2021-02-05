const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const auth = require('../middlewares/auth')

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
router.get('/userlist', auth, async(req, res) => {
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
router.get('/user/:id', async(req, res) => {
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
router.patch('/user/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const user = await User.findById(req.params.id)
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)         
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete Profile
router.delete('/user/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if(!user) {
            res.status(404).send()
        }
        await user.remove()
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router