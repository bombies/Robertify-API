const { Schema } = require('mongoose');
const mongoose = require("mongoose");
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;

const schema = new Schema({
    user_id: Long,
    tracks: Array
});

module.exports = schema;