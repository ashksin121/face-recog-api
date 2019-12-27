const mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    entries: {
        type: Number,
        default: 0
    },
    joined: {
        type: String,
        default: null
    }
})

module.exports = {User};