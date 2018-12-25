const debug = require("debug")("node-angular"); // debug -> given by node
const http = require("http"); // nodejs package, require() -> nodejs function
const {
    app
} = require('./server/app'); // express app

// validating the PORT
const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

// checks for any Error's
const onError = error => {
    const addr = server.address();
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};


// logging - we r listing to incoming request
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
};

// const server = http.createServer((req, resp) => {
//     resp.end('This is my first response'); // end code related to response
// }); // create web server

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port); // setting port

const server = http.createServer(app); // create node server which uses express

server.on("error", onError); // registring listeners (this is listening for - errors)
server.on("listening", onListening); // registring listeners (this is listening for - logging any incoming request)

server.listen(port); // start the server