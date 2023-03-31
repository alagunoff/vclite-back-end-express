require('dotenv').config()
const express = require('express')

const authRouter = require('./src/routers/auth')
const usersRouter = require('./src/routers/users')

const app = express()
app.listen(3000)
app.use('/static', express.static('static'))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/users', usersRouter)
