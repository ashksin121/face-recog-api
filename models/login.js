const mongoose = require('mongoose');

var Login = mongoose.model('Login', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = {Login};