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
    }
});

let PostModel = mongoose.model('post_collection', postSchema);

module.exports = {
    PostModel
};