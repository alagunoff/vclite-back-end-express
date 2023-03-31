const express = require('express')

const usersRouter = require('./routers/users')

const app = express()
app.listen(3000)
app.use(express.json())
app.use('/users', usersRouter)
