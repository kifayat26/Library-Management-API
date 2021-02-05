const mongoose = require('mongoose')
//const validator = require('validator')
//const jwt = require('jsonwebtoken')
//const bcrypt = require('bcryptjs')

const bookLoanSchema = new mongoose.Schema({
    bookID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    isBookLoanRequestPending: {
        type: Boolean,
        default: true
    },
    isBookLoanRequestAccepted: {
        type: Boolean,
        default: false
    },
    isBookReturned: {
        type: Boolean,
        default: false
    },
    requestDate: {
        type: Date,
        default: Date.now()
    },
    startingDate: {
        type: Date
    },
    endingDate: {
        type: Date
    }
})

const BookLoan = mongoose.model('BookLoan', bookLoanSchema)

module.exports = BookLoan