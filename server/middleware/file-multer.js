const multer = require('multer');



const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

// !logic to validate the image recieved from front-end and storing it in the node server -> '/server/images' folder
const storage = multer.diskStorage({
    destination: (req, file, callback) => { // this will be executed , when multer tries to save the file
        const pathOfImageStored = 'server/images';
        const isValidMimeType = MIME_TYPE_MAP[file.mimetype];
        let error;
        if (isValidMimeType) {
            error = null;
        } else {
            error = new Error('Invalid mime type');
        }

        callback(error, pathOfImageStored); // first argum of callback is any_error, 2nd argum is path of image stored
    },
    filename: (req, file, callback) => {

        const name = file.originalname.toLowerCase().split(' ').join('_'); // any white space in the image path is replaced with _ (underscore)
        const extension = MIME_TYPE_MAP[file.mimetype]; // [file.mimetype -> will get the extension of image and then we r mapping
        // to required value from our const -> MIME_TYPE_MAP
        callback(null, name + '-' + Date.now() + '.' + extension); // first argum of callback is any_error, 2nd argum is image file name
    }
})

multerImageMiddleware = multer({
    storage: storage
}).single('imageProp');

module.exports = {
    multerImageMiddleware
}