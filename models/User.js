const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    pins: { type: Array, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);