const Redis = require('ioredis');
 
module.exports.redis = new Redis({
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
});