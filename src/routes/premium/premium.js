const router = require('express').Router();
const Premium = require('../../models/Premium')
const Joi = require('@hapi/joi');
const {redis} = require("../../utils/RedisClient");

const HASH_NAME = 'ROBERTIFY_PREMIUM#';

const postBodyValidate = (body) => {
    const validate = Joi.object({
        user_id: Joi.string().required(),
        user_email: Joi.string().email().required(),
        premium_type: Joi.number().required(),
        premium_tier: Joi.number().required(),
        premium_servers: Joi.array().items(Joi.string()),
        premium_started: Joi.string().required(),
        premium_expires: Joi.string().required()
    })
    return validate.validate(body);
}

router.post('/', async(req, res) => {
    const { body } = req;
    const { error } = postBodyValidate(body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });

    try {
        const existingDoc = await Premium.findOne({user_id: body.user_id});
        if (existingDoc) {
            await redis.del(HASH_NAME + body.user_id);
            await Premium.deleteOne({user_id: body.user_id});
        }

        const doc = new Premium(body);
        const savedDoc = await doc.save();
        redis.setex(HASH_NAME + body.user_id, 3600, JSON.stringify(savedDoc._doc))
        return res.status(200).json({ success: true, data: savedDoc })
    } catch (ex) {
        return res.status(500).json({ success: false, error: ex })
    }
})

router.get('/', async (req, res) => {
    const allDocs = await Premium.find();
    return res.status(200).json(allDocs);
})

router.get('/:userId', async(req, res) => {
    const { userId } = req.params;
    const cachedInfo = await redis.get(HASH_NAME + userId);

    // Cache hit
    if (cachedInfo)
        return res.status(200).json(JSON.parse(cachedInfo));

    try {
        const existingDoc = await Premium.findOne({ user_id: userId });
        if (!existingDoc)
            return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId})

        redis.setex(HASH_NAME + userId, 3600, JSON.stringify(existingDoc._doc));
        return res.status(200).json({ success: true, data: existingDoc })
    } catch (ex) {
        return res.status(500).json({ success: false, error: ex })
    }
})

router.patch('/', async(req, res) => {
    const { body } = req;
    const { error } = postBodyValidate(body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });

    const userId = body.user_id;
    const existingDoc = await Premium.findOne({ user_id: userId });
    if (!existingDoc)
        return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId});

    existingDoc.premium_type = body.premium_type;
    existingDoc.premium_tier = body.premium_tier;
    existingDoc.premium_servers = body.premium_servers;
    existingDoc.premium_started = body.premium_started;
    existingDoc.premium_expires = body.premium_expires;
    await existingDoc.save();
    redis.setex(HASH_NAME + userId, 3600, JSON.stringify(existingDoc._doc));
    return res.status(200).json({ success: true, data: existingDoc })
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const cachedInfo = await redis.get(HASH_NAME + userId);

    if (cachedInfo)
        redis.del(HASH_NAME + userId);

    try {
        const existingDoc = await Premium.findOne({ user_id: userId });
        if (!existingDoc)
            return res.status(404).json({ success: false, error: 'There is no such premium user with the id: ' + userId})

        await Premium.deleteOne({ user_id: userId });
        return res.status(200).json({ success: true })
    } catch (ex) {
        return res.status(500).json({ success: false, error: ex })
    }
})

module.exports = router;