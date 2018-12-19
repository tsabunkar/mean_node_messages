// first mongoose file, which will get executed
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const url = process.env.MONGODB_URI;

mongoose.connect(url, { // !remove deprication warning
    useNewUrlParser: true
});
//for production env, we are using the mongodb uri as -> process.env.MONGODB_URI

module.exports = {
    mongoose
};
// !exporting this mongoose, where some operations r perfomed,
//! (now whole application wil be using this mongoose only, rather than importing directly
// !from mongoose libr)