const mongoose = require('mongoose')
//const validator = require('validator')
//const jwt = require('jsonwebtoken')
//const bcrypt = require('bcryptjs')

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    authorID: {
        type: String
    }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book