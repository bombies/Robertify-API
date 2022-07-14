const { Schema } = require('mongoose');

const schema = new Schema({
    id: Number,
    name: String,
    description: String,
    category: String
})

module.exports = schema;