const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;

const schema = mongoose.Schema({
    random_messages: Array,
    identifier: String,
    reports: Object,
    latest_alert: Object,
    developers: Array,
    alert_viewers: Array,
    last_booted: Long,
    suggestions: Object,
    guild_count: Number
}, {
    collection: 'main'
});

module.exports = schema;