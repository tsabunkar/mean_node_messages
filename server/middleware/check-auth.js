const jwt = require('jsonwebtoken');

// !Validating the token which is attached in the header repsonse, weather reqest is coming from valid client
let isUserAuthenticated = (req, resp, next) => {
    try {
        //  req.get('Authorization') -> fetch value of Authorization key from request header
        const token = req.get('Authorization').split(' ')[1]; // token (key,value)-> Bearer sfjRHKhksfgh23jksf

        // !Manually adding decodedToken in the request
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // ! creating custom property - customUserDataStorage in request, which has email and userId that
        // ! was send during to angular when '/login' i.e- send as jwt.sign() as values (#hasehed)
        req.customUserDataStorage = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }

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