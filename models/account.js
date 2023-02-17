const mongoose =require('mongoose');

const {Schema} = mongoose;

const accountSchema = Schema({
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        enum:["ROLE_ADMIN","ROLE_USER","ROLE_SELLER"],
        required: true
    }
}, {timestamps: true});

module.exports =  mongoose.model('account', accountSchema);