import express from 'express'
import dotenv from 'dotenv'

import usersRouter from 'routers/users'
import authRouter from 'routers/auth'
// const authorsRouter = require('./src/routers/authors')
// const postsRouter = require('./src/routers/posts')
// const draftsRouter = require('./src/routers/drafts')
// const categoriesRouter = require('./src/routers/categories')
// const tagsRouter = require('./src/routers/tags')

dotenv.config()

const app = express()
app.listen(3000)
app.use('/static', express.static('static'))
app.use(express.json())
app.use('/users', usersRouter)
app.use('/auth', authRouter)
// app.use('/authors', authorsRouter)
// app.use('/posts', postsRouter)
// app.use('/drafts', draftsRouter)
// app.use('/categories', categoriesRouter)
// app.use('/tags', tagsRouter)
