const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const authorRouter = require('./routers/author')
const bookRouter = require('./routers/book')
const bookLoanRouter = require('./routers/book-loan')
const bookLoanRequestRouter = require('./routers/book-loan-request')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(authorRouter)
app.use(bookRouter)
app.use(bookLoanRouter)
app.use(bookLoanRequestRouter)

app.listen(port, () => {
    console.log('server is up on port ' + port)
})