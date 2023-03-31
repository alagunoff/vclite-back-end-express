const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/users')

router.post('', createUser)
// router.get('/', controller.getUsers);
// router.get('/:id', controller.getUser);
// router.put('/:id', controller.updateUser);
// router.delete('/:id', controller.deleteUser);

module.exports = router
