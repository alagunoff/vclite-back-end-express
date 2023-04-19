const express = require('express')
const router = express.Router()

const {
  createDraft,
  getDrafts,
  updateDraft,
  deleteDraft
} = require('../controllers/drafts')
const { authenticateUser, isAdmin } = require('../middlewares/auth')

router.post('', [authenticateUser()], createDraft)
router.get('', [authenticateUser()], getDrafts)
router.patch('/:id', [authenticateUser(404), isAdmin], updateDraft)
router.delete('/:id', [authenticateUser(404), isAdmin], deleteDraft)

module.exports = router
