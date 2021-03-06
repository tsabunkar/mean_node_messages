// creating Post Schema/Model
const {
    mongoose
} = require('../db/mongoose_config');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    // mapping userSchema with postMessage Schema -> Authorization
    _creator: {
        type: mongoose.Schema.Types.ObjectId, // storing ObjectId of user ->who has created this post object
        ref: "user_collection", // giving reference to the userModel
        required: true
    }
});

let PostModel = mongoose.model('post_collection', postSchema);

module.exports = {
    PostModel
};