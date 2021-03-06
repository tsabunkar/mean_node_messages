const {
    PostModel
} = require('../models/post');


createPostMessage = (req, resp, next) => {
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

}



fetchAllPostMessages = (req, resp, next) => { // ! Instead of app.use() --we_can_use--> app.get()

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
}



deletePostMessage = (req, resp, next) => { // !safeguarding DELETE by -> isUserAuthenticated middleware
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

};



updatePostMessage = (req, resp, next) => { // !safeguarding PUT by -> isUserAuthenticated middleware

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
            if (result.n > 0) { // if same user who created has modified the object
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
};


getPostMessageById = (req, resp, next) => {
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
}




module.exports = {
    createPostMessage,
    fetchAllPostMessages,
    deletePostMessage,
    updatePostMessage,
    getPostMessageById
}