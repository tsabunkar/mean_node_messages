const jwt = require('jsonwebtoken');

// !Validating the token which is attached in the header repsonse, weather reqest is coming from valid client
let isUserAuthenticated = (req, resp, next) => {
    try {
        //  req.get('authorization') -> fetch value of authorization key from request header
        const token = req.get('authorization').split(' ')[1]; // token (key,value)-> Bearer sfjRHKhksfgh23jksf
        console.log(token);
        jwt.verify(token, 'mySecreat123!');
        next();

    } catch (err) {
        resp.status(401).json({
            message: 'failed to authorize in the middleware',
            data: err,
            status: 401
        })
    }
}

module.exports = {
    isUserAuthenticated
}