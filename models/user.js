const mongoose = require('mongoose');

const {Schema} = mongoose;


const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema);