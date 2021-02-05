const express = require('express')
require('../db/mongoose')
const Author = require('../models/author')
const auth = require('../middlewares/auth')
const adminAuth = require('../middlewares/adminAuth')

const router = new express.Router()

//create author
router.post('/author', auth, adminAuth,  async(req, res) => {
    const author = new Author(req.body)

    try {
        await author.save()
        res.status(201).send(author)
    } catch (error) {
        res.status(400).send(error)
    }
})

//read authorList
router.get('/authorlist', auth, async(req, res) => {
    try{
        const authors = await Author.find({})
        res.send(authors)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of author names includes specific substring: name
router.get('/authorlist/:name', auth, async(req, res) => {
    const name = req.params.name
    try {
        const authors = await Author.find({ name: {$regex: name} })
        res.send(authors)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read author by id
router.get('/author/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const author = await Author.findById(_id)
        if(!author) {
            return res.status(404).send()
        }
        res.send(author)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//update author by id
router.patch('/author/:id', auth, adminAuth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const author = await Author.findById(_id)
        if(!author) {
            res.status(404).send()
        }
        updates.forEach(update => author[update] = req.body[update])
        await author.save()
        res.send(author)         
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete author
router.delete('/author/:id', auth, adminAuth, async (req, res) => {
    try {
        const _id = req.params.id
        const author = await Author.findById(_id)
        if(!author) {
            res.status(404).send()
        }
        await author.remove()
        res.send(author)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router