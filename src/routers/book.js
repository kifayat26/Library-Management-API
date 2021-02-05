const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const Book = require('../models/book')
const Author = require('../models/author')
const BookLoan = require('../models/book-loan')

const router = new express.Router()

//create book
router.post('/book', async(req, res) => {
    const book = new Book(req.body)

    try {
        await book.save()
        res.status(201).send(book)
    } catch (error) {
        res.status(400).send(error)
    }
})

//read bookList
router.get('/booklist', async(req, res) => {
    try {
        const books = await Book.find({})
        res.send(books)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book names includes specific substring: name
router.get('/bookList/:name', async(req, res) => {
    const name = req.params.name
    
    try {
        const books = await Book.find({ name: {$regex: name} })
        res.send(books)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read book by id
router.get('/book/:id', async(req, res) => {
    const _id = req.params.id

    try {
        const book = await Book.findById(_id)
        if(!book) {
            return res.status(404).send()
        }
        res.send(book)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//update boook by id: can change name of the book and name of the author from the authorList 
//if the author name is not in the list, it will send an error 
router.patch('/book/:id', async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'authorID']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    if(updates['authorID']) {
        const author = await Author.findById(updates['authorID'])
        if(!author) {
            return res.status(404).send({ error: 'Author name is is not on the list' })
        }
    }

    try {
        const book = await Book.findById(_id)

        updates.forEach(update => author[update] = req.body[update])
        await book.save()
        res.send(book)         
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete book
router.delete('/book/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const book = await Book.findById(_id)
        if(!book) {
            res.status(404).send()
        }
        await book.remove()
        res.send(book)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router
