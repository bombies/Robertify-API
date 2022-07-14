const mongoose = require('mongoose');

module.exports = function connectionFactory() {
    const con = mongoose.createConnection(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`
    );

    con.model('Guild', require('../schemas/Guild'), 'guilds');
    con.model('Premium', require('../schemas/Premium'), 'premium');
    con.model('Main', require('../schemas/Main'), 'main');
    con.model('FavouriteTracks', require('../schemas/FavouriteTracks'), 'favouritetracks');
    con.model('Command', require('../schemas/Command'), 'commands');

    return con;
}