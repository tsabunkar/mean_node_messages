const express = require('express');
const {
    UserModel
} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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



/* async function checkenteredPasswordIsValid(req, userObject) {
    console.log(req.body.password, userObject[0].password);

    const isValidpassword = await new Promise((resolve, reject) => {
        bcrypt.compare(req.body.password, userObject[0].password, function (err, isValid) {
            console.log('bro!', isValid, err);
            if (err) reject(err)
            resolve(isValid)
        });
    });

    return isValidpassword;
} */


router.post('/login', async (req, resp, next) => {

    // !Wheater email exist ?
    try {
        let userObject = await UserModel.find({
            email: req.body.email
        });

        if (!userObject) { // user object doest not exist
            resp.status(401).json({
                message: 'User Object doesnot exist in db',
                users: 'failed',
                status: 401
            });
            return
        }

        // !we found the user object with valid email and lets check the password enter is valid
        let isValidpassword = await bcrypt.compare(req.body.password, userObject[0].password);
        // !NOTE:- await dosent wait for bcrypt.compare because bcrypt.compare does not return a promise. Soo->
        // let isValidpassword = checkenteredPasswordIsValid(req, userObject);


        if (!isValidpassword) {
            resp.status(401).json({
                message: 'Authentication failed, bocz is password is wrong!!',
                users: err,
                status: 401
            });
            return

        } else { // !valid user and password
            // !create json web token

            const token = jwt.sign({
                email: userObject.email,
                userId: userObject._id
            }, 'mySecreat123!', {
                expiresIn: '1h', // token will be valid/expired after 1hour 
            });


            resp.setHeader('my-token', token); // !setting token in the header
            resp.status(200).json({
                message: 'valid user name and password!',
                users: 'valid',
                expiresIn: 3600, // in seconds
                status: 200
            });

        }

    } catch (err) {
        resp.status(401).json({
            message: 'Authentication failed',
            users: err,
            status: 401
        });
    }

});


module.exports = {
    authRoutes: router
}