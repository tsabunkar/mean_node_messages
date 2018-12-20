require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {
    mongoose
} = require('./db/mongoose_config');
const {
    PostModel
} = require('./models/post');

// route/path
const app = express(); // app -> express application, express is a middleware for request and response
// b/w client and server

// !below code is done in separate file -> db/mongoose_config.js
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true
// });


mongoose.connect(process.env.MONGODB_URI) // connecting to mongodb db atlas
    .then(() => {
        console.log('connected to db !');
    })
    .catch(() => {
        console.log('failed to connect to db!');
    })

// use new middleware
/* app.use((req, resp, next) => {
    console.log('first middle-ware');
    next(); //request will continue its journey
}); */

app.use(bodyParser.json()); // !middleware which parses incoming request in JSON format, this body-parser middleware must be
// !registered with express so wrote inside app.use();

app.use(bodyParser.urlencoded({ // to parse
    extended: false
}));


// !CORS error-
app.use((req, resp, next) => {
    // before contiuing the request to next middle ware just written below this middleware want to remove CORS error
    resp.setHeader('Access-Control-Allow-Origin', '*'); // allowing access to all the url/paths
    resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // it may have this headers key
    resp.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS")

    next();
});

// Instead of using use() we can be use- http methods like-
/* app.post();
app.get();
app.put(); */

app.post('/api/posts', (req, resp, next) => {
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

});

// !All this middleware will executed sequentially as they written
app.get('/api/posts', (req, resp, next) => { // ! Instead of app.use() --we_can_use--> app.get()
    // resp.send('hello express'); // sending response for incoming request
    /*    const posts = [{
               title: 'Test-1',
               content: 'This is test-1 description',
               id: 1
           },
           {
               title: 'Test-2',
               content: 'This is test-2 description',
               id: 2
           },
       ]; */
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
app.delete('/api/posts/:idToDelete', (req, resp, next) => {
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
app.put('/api/posts/:idToBeUpdated', (req, resp, next) => {
    const postToBeUpdated = new PostModel({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    })
    PostModel.findByIdAndUpdate({ _id: req.params.idToBeUpdated }, postToBeUpdated)
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

module.exports = { // exporting the app
    app
};