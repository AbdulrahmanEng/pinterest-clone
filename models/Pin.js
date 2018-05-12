const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
    imageUrl: {type: String, required: true},
    createdBy: {type: String, required: true},
    website: {type: String, required: true},
    description: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Pin', PinSchema);