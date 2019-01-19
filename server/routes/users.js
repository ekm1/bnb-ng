const express = require('express');
const User = require('../controllers/user');
const router = express.Router();

//Authenticate User ENDPOINT

router.post('/auth', User.auth);

//Register User ENDPOINT

router.post('/register', User.register);

router.get('/admin/users', User.adminAuthMiddleware, User.getAllUsers);

module.exports = router;
