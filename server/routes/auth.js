const express = require('express');
const {
    UserModel
} = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router(); // Router constructor

// !POST
// create a new user and save in the DB
router.post('/signup', (req, resp, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hashedPaasword => {

            const userModel = new UserModel({
                email: req.body.email,
                password: hashedPaasword
            });
            userModel.save()
                .then(result => {
                    resp.status(201).json({
                        message: 'User created successfully',
                        users: result,
                        status: 200
                    });
                })
                .catch(err => {
                    resp.status(500).json({
                        message: 'User created failed',
                        users: err,
                        status: 500
                    });
                });
        });



});

module.exports = {
    authRoutes: router
}