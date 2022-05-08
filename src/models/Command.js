const mongoose = require('mongoose');

const schema = mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    category: String
})

module.exports = mongoose.model('Commands', schema)