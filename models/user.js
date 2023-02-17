const mongoose = require('mongoose');

const {Schema} = mongoose;


const userSchema = Schema({
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
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