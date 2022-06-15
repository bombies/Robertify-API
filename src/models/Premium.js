const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user_id: String,
    user_email: String,
    premium_type: Number,
    premium_tier: Number,
    premium_servers: Array,
    premium_started: String,
    premium_expires: String,
}, { collection: 'premium' });

module.exports = mongoose.model('Premium', schema);