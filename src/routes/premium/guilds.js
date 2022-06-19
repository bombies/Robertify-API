const router = require('express').Router();
const Premium = require('../../models/Premium')
const { redis } = require('../../utils/RedisClient');
const Joi = require('@hapi/joi');
const HASH_NAME = 'ROBERTIFY_PREMIUM_GUILDS#'

const bodyValidate = (body) => {
    const validationObj = Joi.array().items(Joi.string()).required();
    return validationObj.validate(body);
}

router.get('/', async (req, res) => {
    const cachedInfo = await redis.get(HASH_NAME);
    if (cachedInfo)
        return res.status(200).json(JSON.parse(cachedInfo));

    const guilds = setGuildCache();
    return res.status(200).json(guilds);
})

router.get('/user/:guildId', async (req, res) => {
    const { guildId } = req.params;
    const userDoc = await Premium.findOne({ premium_servers: guildId });
    if (!userDoc)
        return res.status(404).json({ success: false, error: "There was no information found for guild with id: " + guildId})
    return res.status(200).json(userDoc);
})

router.post('/:userId', async (req, res) => {
    const { body } = req;
    const { userId } = req.params;
    const { error } = bodyValidate(body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });

    const userDoc = await Premium.findOne({ user_id: userId });
    if (!userDoc)
        return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId});
    userDoc.premium_servers = body;
    await userDoc.save();
    await setGuildCache();
    return res.status(200).json({ success: true });
})

router.patch('/:userId', async (req, res) => {
    const { body } = req;
    const { userId } = req.params;
    const { error } = bodyValidate(body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });

    const userDoc = await Premium.findOne({ user_id: userId });
    if (!userDoc)
        return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId});
    const uniqueItems = body.filter(item => !userDoc.premium_servers.includes(item))
    userDoc.premium_servers = [...userDoc.premium_servers, ...uniqueItems];
    await userDoc.save();
    await setGuildCache();
    return res.status(200).json({ success: true });
})

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const userDoc = await Premium.findOne({ user_id: userId });
    if (!userDoc)
        return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId});
    return res.status(200).json(userDoc.premium_servers);
})

const setGuildCache = async () => {
    const collection = await Premium.find();
    const guilds = [];

    collection.forEach(doc => guilds.push(...doc.premium_servers));

    redis.set(HASH_NAME, JSON.stringify(guilds));
    return guilds;
}

const updateGuildCache = async (guilds) => {
    const cachedInfo = await redis.get(HASH_NAME);
    if (cachedInfo)
        return;
    const cachedInfoObj = JSON.parse(cachedInfo);
    cachedInfoObj.push(...guilds);
    await redis.set(HASH_NAME, JSON.stringify(cachedInfoObj))
}

module.exports = router;