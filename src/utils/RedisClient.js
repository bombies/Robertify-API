const Redis = require('ioredis');
 
module.exports.redis = new Redis(process.env.REDIS_URL);