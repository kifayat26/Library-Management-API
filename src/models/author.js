const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (value == "") {
                throw new Error('author name is invalid')
            }
        }
    }
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author