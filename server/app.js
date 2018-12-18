const express = require('express');

// route/path
const app = express(); // app -> express application, express is a middleware for request and response
// b/w client and server

// use new middleware
/* app.use((req, resp, next) => {
    console.log('first middle-ware');
    next(); //request will continue its journey
}); */

app.use('/api/posts', (req, resp, next) => {
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
        posts
    });

    // which shld not call next() bcoz we want to finish this (http://localhost:3000/api/posts) request 
});

module.exports = { // exporting the app
    app
};