const express = require('express');

const {
    isUserAuthenticated
} = require('../middleware/check-auth');
const {
    multerImageMiddleware
} = require('../middleware/file-multer');
const PostMessageController = require('../controllers/posts');

const router = express.Router(); // Router constructor



// !POST
// router.post('', (req, resp, next) => {
// ?The 2nd argument is -> middleware which we want to run before running the callback function i.e-(req, resp, next)
// ?In between of first and last argum, We can have zero or any number of arguments. This arguments are middleware which will be
// ? executed from left to right
// !multer(storage).single('image') -> means multer will extract single file from incoming request and will try to find a
// !imageProp property on incoming request body
// !safeguarding POST by -> isUserAuthenticated middleware
router.post('', isUserAuthenticated, multerImageMiddleware, PostMessageController.createPostMessage);


// !GETALL
// !All this middleware will executed sequentially as they written
router.get('', PostMessageController.fetchAllPostMessages);


// !DELETE by Id
router.delete('/:idToDelete', isUserAuthenticated, PostMessageController.deletePostMessage);


// !PUT
router.put('/:idToBeUpdated', isUserAuthenticated, multerImageMiddleware, PostMessageController.updatePostMessage);


// !GET Particular PostMessage
router.get('/:id', PostMessageController.getPostMessageById);


module.exports = {
    postsMessageRoutes: router
}