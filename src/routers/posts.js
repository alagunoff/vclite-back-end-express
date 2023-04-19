const express = require('express')
const router = express.Router()

const {
  createPost,
  getPosts,
  updatePost,
  deletePost
} = require('../controllers/posts')
const { authenticateUser, isAdmin } = require('../middlewares/auth')
const commentsRouter = require('./comments')

router.post('', [authenticateUser()], createPost)
router.get('', getPosts)
router.patch('/:id', [authenticateUser(404), isAdmin], updatePost)
router.delete('/:id', [authenticateUser(404), isAdmin], deletePost)

router.use('/:postId/comments', commentsRouter)

module.exports = router
