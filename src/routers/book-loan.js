const express = require('express')
const excel = require('node-excel-export')
require('../db/mongoose')
const BookLoan = require('../models/book-loan')
const auth = require('../middlewares/auth')
const adminAuth = require('../middlewares/adminAuth')

const router = new express.Router()

//read list of book-loans that are returned and not returned 
router.get('/bookloanlist', auth, adminAuth, async(req, res) => {
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
router.get('/bookloanlistunreturned', auth, adminAuth, async(req, res) => {
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
router.get('/bookloanlistreturned', auth, adminAuth, async(req, res) => {
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
router.get('/bookloanlist/me', auth, async(req, res) => {
    const userID = req.user._id
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
router.get('/bookloanlistunreturned/me', auth, async(req, res) => {
    const userID = req.user._id
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
router.get('/bookloanlistreturned/me', auth, async(req, res) => {
    const userID = req.user._id
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
router.patch('/bookloanreturned/:id', auth, adminAuth, async(req, res) => {
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

//excel export book loan: list of unreturned books
router.get('/bookloandownload', auth, adminAuth, async(req, res) => {
    const isBookLoanRequestPending = false
    const isBookLoanRequestAccepted = true
    const isBookReturned = false

    try {
        const bookLoans = await BookLoan.find({ 
            isBookLoanRequestPending,
            isBookLoanRequestAccepted,
            isBookReturned
        })

        const report = excel.buildExport([{
            name: 'book loan',
            bookLoans
        }])
        res.send(bookLoans)  
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router