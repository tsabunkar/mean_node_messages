// creating User Schema/Model
const {
    mongoose
} = require('../db/mongoose_config');

const uniqueValidator = require('mongoose-unique-validator'); // used for unique validation 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // it does not act as validator, just used for internal optimaization
    },
    password: {
        type: String,
        required: true
    }
});

// uniqueValidator -> validates email, checks if email already exist in the db
userSchema.plugin(uniqueValidator);

let UserModel = mongoose.model('user_collection', userSchema);

module.exports = {
    UserModel
};