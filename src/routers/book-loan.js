const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const Book = require('../models/book')
const Author = require('../models/author')
const BookLoan = require('../models/book-loan')

const router = new express.Router()

//read list of book-loans that are returned and not returned 
router.get('/bookloanlist', async(req, res) => {
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true

    try {
        const bookLoans = await BookLoan.find({ 
            isBookLoanRequestPending,
            isBookLoanRequestAccepted
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loans that are not returned 
router.get('/bookloanlistunreturned', async(req, res) => {
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true
    const isBookReturned = false

    try {
        const bookLoans = await BookLoan.find({ 
            isBookLoanRequestPending,
            isBookLoanRequestAccepted,
            isBookReturned
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loans that are returned 
router.get('/bookloanlistreturned', async(req, res) => {
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true
    const isBookReturned = true

    try {
        const bookLoans = await BookLoan.find({ 
            isBookLoanRequestPending,
            isBookLoanRequestAccepted,
            isBookReturned
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loans that are returned and not returned by user: id
router.get('/bookloanlist/:id', async(req, res) => {
    const userID = req.params.id
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true

    try {
        const bookLoans = await BookLoan.find({ 
            userID,
            isBookLoanRequestPending,
            isBookLoanRequestAccepted
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loans that are not returned by user: id
router.get('/bookloanlistunreturned/:id', async(req, res) => {
    const userID = req.params.id
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true
    const isBookReturned = false

    try {
        const bookLoans = await BookLoan.find({ 
            userID,
            isBookLoanRequestPending,
            isBookLoanRequestAccepted,
            isBookReturned
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loans that are returned by user: id
router.get('/bookloanlistreturned/:id', async(req, res) => {
    const userID = req.params.id
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true
    const isBookReturned = true

    try {
        const bookLoans = await BookLoan.find({ 
            userID,
            isBookLoanRequestPending,
            isBookLoanRequestAccepted,
            isBookReturned
        })
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//loaned book is returned: update bookLoan 
router.patch('/bookloanreturned/:id', async(req, res) => {
    const _id = req.params.id

    try {
        const bookLoan = await BookLoan.findById(_id)
        
        bookLoan.isBookLoanRequestPending = false
        bookLoan.isBookLoanRequestAccepted = true
        bookLoan.isBookReturned = true
        bookLoan.endingDate = Date.now()

        await bookLoan.save()

        res.send(bookLoan)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router