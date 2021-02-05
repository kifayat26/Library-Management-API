const express = require('express')
require('../db/mongoose')
const BookLoan = require('../models/book-loan')
const auth = require('../middlewares/auth')
const adminAuth = require('../middlewares/adminAuth')
const normalUserAuth = require('../middlewares/normalUserAuth')

const router = new express.Router()

//create book loan request
router.post('/bookloanrequest/:bookID', auth, normalUserAuth, async(req, res) => {
    const bookLoanRequest = new BookLoan({
        bookID: req.params.id,
        userID: req.user._id
    })

    try {
        await bookLoanRequest.save()
        res.status(201).send(bookLoanRequest)
    } catch (error) {
        res.status(400).send(error)
    }
})

//read list of book-loan-request by admin that are pending
router.get('/bookloanrequestlist', auth, async(req, res) => {
    const isBookLoanRequestPending = true

    try {
        const bookLoanRequests = await BookLoan.find({ 
            isBookLoanRequestPending
        })
        res.send(bookLoanRequests)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loan-request by user: id that are pending
router.get('/bookloanrequestpending/:id', auth, async(req, res) => {
    const userID = req.params.id
    const isBookLoanRequestPending = true

    try {
        const bookLoanRequests = await BookLoan.find({ 
            userID,
            isBookLoanRequestPending
        })
        res.send(bookLoanRequests)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//read list of book-loan-request by user: id that are pending or rejected or accepted
router.get('/bookloanrequest/:id', auth, async(req, res) => {
    const userID = req.params.id
    const isBookReturned = false

    try {
        const bookLoanRequests = await BookLoan.find({ 
            userID,
            isBookReturned
        })
        res.send(bookLoanRequests)  
    } catch (error) {
        res.status(500).send(error)
    }
})

//accept book loan request: create book loan
router.patch('/acceptbookloanrequest/:id', auth, adminAuth, async(req, res) => {
    const _id = req.params.id

    try {
        const bookLoanRequest = await BookLoan.findById(_id)
        const bookID = bookLoanRequest.bookID
        const previousBookLoan = await BookLoan.findOne({
            bookID,
            isBookLoanRequestAccepted: true,
            isBookReturned: false
        })
        if(previousBookLoan) {
            return res.status(404).send()
        }
        
        bookLoanRequest.isBookLoanRequestPending = false
        bookLoanRequest.isBookLoanRequestAccepted = true
        bookLoanRequest.isBookReturned = false
        bookLoanRequest.startingDate = Date.now()

        await bookLoanRequest.save()

        res.send(bookLoanRequest)
    } catch (error) {
        res.status(400).send(error)
    }
})

//reject book loan request
router.patch('/rejectbookloanrequest/:id', auth, adminAuth, async(req, res) => {
    const _id = req.params.id

    try {
        const bookLoanRequest = await BookLoan.findById(_id)
        
        bookLoanRequest.isBookLoanRequestPending = false
        bookLoanRequest.isBookLoanRequestAccepted = false
        bookLoanRequest.isBookReturned = false
        bookLoanRequest.startingDate = Date.now()

        await bookLoanRequest.save()

        res.send(bookLoanRequest)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router