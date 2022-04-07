const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', userSchema);