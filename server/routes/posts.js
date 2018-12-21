const express = require('express');
const {
    PostModel
} = require('../models/post');

const router = express.Router(); // Router constructor


// !POST
router.post('', (req, resp, next) => {
    const postRequested = req.body;

    // !saving in mongodb cloud -> mongodb atlas
    const postModel = new PostModel({
        title: req.body.title,
        content: req.body.content
    })
    console.log(postModel);
    postModel.save() // this postmodel collection will be saved in the mongodb db
        .then(createdPost => { // returning the _id value to frontend so that it can update the particular post object
            resp.status(201);
            resp.json({
                message: 'Post addded successfully !',
                postIdCreatedByMongo: createdPost['_id'],
                status: 201
            })
        })
        .catch(err => {
            console.log(err);
        });

});

// !All this middleware will executed sequentially as they written
router.get('', (req, resp, next) => { // ! Instead of app.use() --we_can_use--> app.get()
    // resp.send('hello express'); // sending response for incoming request

    // !fetchind data from mongodb
    PostModel.find().then((resultDocuments) => {
        console.log(resultDocuments);
        resp.status(200);
        resp.json({
            message: 'Posts fetched successfully',
            posts: resultDocuments,
            status: 200
        });

    }).catch((err) => {
        console.log(err);
        resp.status(500);
        resp.json({
            message: 'Posts fetched successfully',
            posts: err,
            status: 500
        });
    });


    // which shld not call next() bcoz we want to finish this (http://localhost:3000/api/posts) request 
});


// !DELETE by Id
router.delete('/:idToDelete', (req, resp, next) => {
    console.log(req.params.idToDelete);
    PostModel.findByIdAndDelete({
            _id: req.params.idToDelete
        })
        .then((result) => {
            console.log('result', result);
            resp.status(200).json({
                message: 'Posts Deleted successfully',
                data: result,
                status: 200
            })
        }).catch((err) => {
            resp.status(200).json({
                message: 'Posts Deleted failed',
                data: err,
                status: 500
            })
        });

});

// !PUT
router.put('/:idToBeUpdated', (req, resp, next) => {
    // console.log('req------', req.body);
    // console.log('params------', req.params.idToBeUpdated);
    // console.log('id------', req.body.id);
    const postToBeUpdated = new PostModel({
        _id: req.params.idToBeUpdated,
        title: req.body.title,
        content: req.body.content
    })
    PostModel.findOneAndUpdate({
            _id: req.params.idToBeUpdated
        }, postToBeUpdated)
        .then((result) => {
            console.log(result);
            resp.status(200).json({
                message: 'Posts Updated successfully',
                data: result,
                status: 200
            })
        }).catch((err) => {
            console.log(err);
        });
});


// !GET Particular PostMessage
router.get('/:id', (req, resp, next) => {
    PostModel.findById(req.params.id).then((post) => {
        resp.status(200).json({
            message: 'Post Message successfully found',
            data: post,
            status: 200
        })
    }).catch((err) => {
        resp.status(200).json({
            message: 'Post Message failed',
            data: err,
            status: 500
        })
    });
});

module.exports = {
    router
}