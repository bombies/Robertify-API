const Command = require('../../models/Command');
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { redis } = require('../../utils/RedisClient');

const HASH_NAME = 'robertifyCommandHash';

const postBodyValidate = Joi.object({
    commands: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().regex(/^(music|management|miscellaneous|utility)$/).required()
    }).required()).unique((a,b) => a.name === b.name).unique((a,b) => a.id === b.id).required()
})

router.post('/', async (req, res) => {
    const { body } = req;
    const { error } = postBodyValidate.validate(body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });

    const commandNames = body.commands.map(command => command.name)
    await Command.deleteMany({ name: { $in: commandNames } });

    const postMessage = await Command.insertMany(body.commands);
    res.status(200).json({ success: true, message: postMessage })
});

router.get('/', async (req, res) => {
    const cachedCommands = await redis.get(HASH_NAME)

    // Cache hit
    if (cachedCommands)
        return res.status(200).json(JSON.parse(cachedCommands))

    // Cache miss
    const commands = await Command.find();
    const commandsData = commands.map(command => ({
        id: command.id,
        name: command.name,
        description: command.description,
        category: command.category
    }))
    await redis.setex(HASH_NAME, 3600, JSON.stringify(commandsData))
    return res.status(200).json(commandsData);
})

router.get('/:command', async (req, res) => {
    const { command } = req.params;

    const cachedCommands = await redis.get(HASH_NAME)

    // Cache hit
    if (cachedCommands) {
        const cachedCommandsObj = JSON.parse(cachedCommands);
        const commandObj = cachedCommandsObj.commands.filter(obj => obj.name.toLowerCase === command);
        return res.status(200).json(commandObj)
    }

    const commandData = await Command.findOne({ name: command });
    if (!commandData)
        return res.status(404).json({ success: false, message: `There was no command with the name ${command}`})
    res.status(200).json({
        id: commandData.id,
        name: commandData.name,
        description: commandData.description,
        category: commandData.category
    });
})

module.exports = router;