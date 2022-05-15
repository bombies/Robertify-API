const Redis = require('ioredis');
 
module.exports.redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});