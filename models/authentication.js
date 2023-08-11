const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


const AuthSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
        uniqueCaseInsensitive: true, // Make the username unique case-insensitive
        trim: true, // Remove leading/trailing whitespace from the username
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    userType: {
        type: String,
        required: true,
        enum: userTypes, // Allow only specific user types defined in the userTypes array
    },
});

AuthSchema.plugin(uniqueValidator, {
    message: 'The {PATH} "{VALUE}" is already taken, please choose another.', // Custom error message for uniqueValidator
});

const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;
