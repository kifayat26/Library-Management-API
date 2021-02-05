const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value == "") {
                throw new Error('book name is invalid')
            }
        }
    },
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book