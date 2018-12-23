const express = require('express');
const {
    PostModel
} = require('../models/post');
const multer = require('multer');
const {
    isUserAuthenticated
} = require('../middleware/check-auth');


const router = express.Router(); // Router constructor

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

// !logic to validate the image recieved from front-end and storing it in the node server -> '/server/images' folder
const storage = multer.diskStorage({
    destination: (req, file, callback) => { // this will be executed , when multer tries to save the file
        const pathOfImageStored = 'server/images';
        const isValidMimeType = MIME_TYPE_MAP[file.mimetype];
        let error;
        if (isValidMimeType) {
            error = null;
        } else {
            error = new Error('Invalid mime type');
        }

        callback(error, pathOfImageStored); // first argum of callback is any_error, 2nd argum is path of image stored
    },
    filename: (req, file, callback) => {

        const name = file.originalname.toLowerCase().split(' ').join('_'); // any white space in the image path is replaced with _ (underscore)
        const extension = MIME_TYPE_MAP[file.mimetype]; // [file.mimetype -> will get the extension of image and then we r mapping
        // to required value from our const -> MIME_TYPE_MAP
        callback(null, name + '-' + Date.now() + '.' + extension); // first argum of callback is any_error, 2nd argum is image file name
    }
})



// !POST
// router.post('', (req, resp, next) => {
// ?The 2nd argument is -> middleware which we want to run before running the callback function i.e-(req, resp, next)
// ?In between of first and last argum, We can have zero or any number of arguments. This arguments are middleware which will be
// ? executed from left to right
// !multer(storage).single('image') -> means multer will extract single file from incoming request and will try to find a
// !imageProp property on incoming request body
router.post('', isUserAuthenticated, multer({ // !safeguarding POST by -> isUserAuthenticated middleware
    storage: storage
}).single('imageProp'), (req, resp, next) => {
    const postRequested = req.body;

    const url = req.protocol + '://' + req.get('host'); // protocol-> will tell weather we r using http or https

    // !saving in mongodb cloud -> mongodb atlas
    const postModel = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename, // image path we r storing the db
        _creator: req.customUserDataStorage.userId
    })
    // console.log(postModel);
    postModel.save() // this postmodel collection will be saved in the mongodb db
        .then(createdPost => { // returning the _id value to frontend so that it can update the particular post object
            resp.status(201);
            resp.json({
                message: 'Post addded successfully !',
                postIdCreatedByMongo: createdPost['_id'],

                postObject: {
                    ...createdPost,
                    id: createdPost._id
                },
                status: 201
            })
        })
        .catch(err => {
            resp.status(500).json({
                message: 'Failed to create PostMessage bcoz- ' + err,
                users: err,
                status: 500
            });
        });

});

// !GETALL
// !All this middleware will executed sequentially as they written
router.get('', (req, resp, next) => { // ! Instead of app.use() --we_can_use--> app.get()

    let pageSize = req.query.pageSize; // extracting pageSize value from query param of url
    let currentPage = req.query.currentPage;

    // converting string to number
    pageSize = +pageSize;
    currentPage = +currentPage;

    const postQuery = PostModel.find();
    if (pageSize && currentPage) { // pageSize && currentPage are not undefined or null (means some value exist, then execute this if stat)
        postQuery
            .skip(pageSize * (currentPage - 1)) // we will not retrieve all records, but will skip first 'n' records
            // for ex- pageSize =10; currentPage =2; -> (10*(2-1)) = (10*1) = 10 (means first 10 recors will be skipped) 
            // thus we r displaying records from 10 to max records(100)
            .limit(pageSize); // will limit/restrict the number of records to display

    }
    let fetchedPostsMessages;

    // !fetchind data from mongodb
    postQuery.then((resultDocuments) => {

            fetchedPostsMessages = resultDocuments;
            return PostModel.countDocuments(); // count the number of records for that model
            // since  -> return PostModel.count(); returns promise so promise resolved in next then block
        })
        .then((countValue) => {
            resp.status(200);
            resp.setHeader('max-records', countValue)
            resp.json({
                message: 'Posts fetched successfully',
                posts: fetchedPostsMessages,
                status: 200
            });

        })
        .catch((err) => {
            resp.status(500);
            resp.json({
                message: 'Failed to fetch the Post Messages bcoz- ' + err,
                posts: err,
                status: 500
            });
        });


    // which shld not call next() bcoz we want to finish this (http://localhost:3000/api/posts) request 
});


// !DELETE by Id
router.delete('/:idToDelete', isUserAuthenticated, (req, resp, next) => { // !safeguarding DELETE by -> isUserAuthenticated middleware
    console.log(req.params.idToDelete);
    PostModel.deleteOne({
            _id: req.params.idToDelete,
            _creator: req.customUserDataStorage.userId
        })
        .then((result) => {
            console.log('result', result);
            if (result.n > 0) {
                resp.status(200).json({
                    message: 'Posts Deleted successfully',
                    data: result,
                    status: 200
                });

            } else {
                resp.status(401).json({
                    message: 'Posts Deleted Failed, bcoz you have not created it bro!',
                    data: result,
                    status: 401
                })
            }

        }).catch((err) => {
            resp.status(500).json({
                message: 'Posts Deleted failed' + err,
                data: err,
                status: 500
            })
        });

});

// !PUT
router.put('/:idToBeUpdated', isUserAuthenticated, multer({
    storage: storage
}).single('imageProp'), (req, resp, next) => { // !safeguarding PUT by -> isUserAuthenticated middleware

    let imagePath = req.body.imagePath;
    if (req.file) { // new image file is uploaded, while updating/editing
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }

    const postToBeUpdated = new PostModel({
        _id: req.params.idToBeUpdated,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        _creator: req.customUserDataStorage.userId
    })
    PostModel.updateOne({
            _id: req.params.idToBeUpdated,
            _creator: req.customUserDataStorage.userId // finding the document, weather creater property also
        }, postToBeUpdated)
        .then((result) => {

            // checking weather the same user who has created it, is updating 
            if (result.nModified > 0) { // if same user who created has modified the object
                resp.status(200).json({
                    message: 'Posts Updated successfully',
                    data: result,
                    status: 200
                })
            } else {
                resp.status(401).json({
                    message: 'Posts Updated Failed, bcoz you have not created it bro!',
                    data: result,
                    status: 401
                })
            }

        }).catch((err) => {
            resp.status(500).json({
                message: 'Failed to update PostMessage bcoz- ' + err,
                users: err,
                status: 500
            });
        });
});


// !GET Particular PostMessage
router.get('/:id', (req, resp, next) => {
    PostModel.findById(req.params.id).then((post) => {

        if (post) {
            resp.status(200).json({
                message: 'Post Message successfully found',
                data: post,
                status: 200
            })
        } else {
            resp.status(500).json({
                message: 'Post Message Not found in the db!',
                data: 'failed',
                status: 500
            })
        }

    }).catch((err) => {
        resp.status(500).json({
            message: 'Post Message failed to get for Id- ' + req.params.id + 'bcoz - ' + err,
            data: err,
            status: 500
        })
    });
});

module.exports = {
    postsMessageRoutes: router
}