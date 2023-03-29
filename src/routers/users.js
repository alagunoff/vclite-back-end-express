const express = require('express');
const router = express.Router();

const {create_user} = require('../controllers/users');

router.post('', create_user);
// router.get('/', controller.getUsers);
// router.get('/:id', controller.getUser);
// router.put('/:id', controller.updateUser);
// router.delete('/:id', controller.deleteUser);

module.exports = router;