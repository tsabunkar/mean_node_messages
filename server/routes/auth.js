const express = require('express');

const router = express.Router(); // Router constructor
const UserController = require('../controllers/auth');

// !POST
// create a new user and save in the DB
router.post('/signup', UserController.createUser);


// !POST
router.post('/login', UserController.userLogin);


module.exports = {
    authRoutes: router
}