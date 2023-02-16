const mongoose = require('mongoose')
const {Schema} = mongoose;

const itemSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverImg: {
        type: String,
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('item', itemSchema);