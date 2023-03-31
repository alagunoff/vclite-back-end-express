const express = require('express')
const router = express.Router()

const { createUser, getUser } = require('../controllers/users')
const authenticateUser = require('../middlewares/authenticateUser')

router.post('', createUser)
router.get('', authenticateUser, getUser)
// router.get('/', controller.getUsers);
// router.get('/:id', controller.getUser);
// router.put('/:id', controller.updateUser);
// router.delete('/:id', controller.deleteUser);

module.exports = router
