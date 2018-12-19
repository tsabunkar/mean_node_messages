const express = require('express');
const bodyParser = require('body-parser');

// route/path
const app = express(); // app -> express application, express is a middleware for request and response
// b/w client and server

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
    console.log(postRequested);
    resp.status(201);
    resp.json({
        message: 'Post addded successfully !',
        posts: postRequested,
        status: 201
    })
});

// !All this middleware will executed sequentially as they written
app.use('/api/posts', (req, resp, next) => { // ! Instead of app.use() --we_can_use--> app.get()
    // resp.send('hello express'); // sending response for incoming request
    const posts = [{
            title: 'Test-1',
            content: 'This is test-1 description',
            id: 1
        },
        {
            title: 'Test-2',
            content: 'This is test-2 description',
            id: 2
        },
    ];
    resp.status(200);
    resp.json({
        message: 'Posts fetched successfully',
        posts,
        status: 200
    });

    // which shld not call next() bcoz we want to finish this (http://localhost:3000/api/posts) request 
});

module.exports = { // exporting the app
    app
};