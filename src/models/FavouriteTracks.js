const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;

const schema = mongoose.Schema({
    user_id: Long,
    tracks: Array
});

module.exports = mongoose.model('FavouriteTracks', schema);