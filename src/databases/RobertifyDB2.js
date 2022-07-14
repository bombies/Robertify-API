const mongoose = require('mongoose');

module.exports = function connectionFactory() {
    const con = mongoose.createConnection(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME2}`
    );

    con.model('Guild', require('../schemas/Guild'), 'guilds');
    con.model('Main', require('../schemas/Main'), 'main');

    return con;
}