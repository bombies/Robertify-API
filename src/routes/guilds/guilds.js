const router = require('express').Router();
const mongoose = require('mongoose');
const db = require('../../databases/RobertifyDB');
const db2 = require('../../databases/RobertifyDB2');
const Collections = require('../../databases/Collections');
const Guild = db().collection(Collections.Guilds.description);
const Main = db().collection(Collections.Main.description);
const GuildTwo = db2().collection(Collections.Guilds.description);
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;
const Joi = require('@hapi/joi');
const { redis } = require('../../utils/RedisClient');

const HASH_NAME = "ROBERTIFY_GUILD#";

const validatePATCHBody = (body) => {
    const validateObj = Joi.object({
        toggles: Joi.object(),
        eight_ball: Joi.array().items(Joi.string().allow()),
        theme: Joi.string(),
        log_channel: Joi.string(),
        permissions: Joi.object(),
        restricted_channels: Joi.object({
            voice_channels: Joi.array().items(Joi.string()).required(),
            text_channels: Joi.array().items(Joi.string()).required()
        }),
        twenty_four_seven_mode: Joi.bool(),
        autoplay: Joi.bool(),
        locale: Joi.string().allow(null).allow(undefined)
    });
    return validateObj.validate(body);
}

const idValidate = (data) => {
    const validation = Joi.object({
        guild_id: Joi.string().regex(/^\d{17,18}$/).required()
    });
    return validation.validate(data);
}

const bodyValidate = (data) => {
    const validation = Joi.object({
        fields: Joi.array().items(Joi.string().max(128)).required()
    });
    return validation.validate(data);
}

router.get('/', async(req, res) => {
    const guildCount = (await Main.findOne())?.guild_count;
    if (!guildCount)
        return res.status(404).send({ message: "The guild count hasn't been set yet." });
    return res.status(200).send({ count: guildCount })

});

router.get('/:bot_id/:guild_id', async (req, res) => {
    const { bot_id, guild_id } = req.params;
    const { error } = idValidate({ guild_id: guild_id });
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    let guild;

    switch (bot_id) {
        case "1": {
            guild = await Guild.findOne({ server_id : Long.fromString(req.params.guild_id) });
            break;
        }
        case "2": {
            guild = await GuildTwo.findOne({ server_id : Long.fromString(req.params.guild_id) });
            break;
        }
        default: return res.status(400).json({ success: false, message: `There was no bot with the ID "${bot_id}"` })
    }
    await handleGuildFetch(req, res, guild);
})

router.get('/:guild_id', async (req, res) => {
    const { error } = idValidate(req.params);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    const guild = await Guild.findOne({ server_id : Long.fromString(req.params.guild_id) });
    await handleGuildFetch(req, res, guild);
});

const handleGuildFetch = async (req, res, guild) => {
    if (!guild)
        return res.status(404).send({ message: `There was no guild found with the ID ${req.params.guild_id}`});

    const permissionsParsed = {};
    const restrictedChannelsParsed = {};

    for (let key in guild.permissions) {
        if (!(guild.permissions[key] instanceof Array)) {
            permissionsParsed[key] = guild.permissions[key];
            continue;
        }

        permissionsParsed[key] = guild.permissions[key].map(val => val.toString());
    }

    for (let key in guild.restricted_channels) {
        if (!(guild.restricted_channels[key] instanceof Array)) {
            permissionsParsed[key] = guild.restricted_channels[key];
            continue;
        }

        restrictedChannelsParsed[key] = guild.restricted_channels[key].map(val => val.toString());
    }

    guild.server_id = guild.server_id.toString();
    guild.permissions = permissionsParsed;
    guild.restricted_channels = restrictedChannelsParsed;
    guild.announcement_channel = guild.announcement_channel.toString();
    guild.log_channel = guild.log_channel ? guild.log_channel.toString() : null;
    guild.locale ??= 'english';

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(200).send(guild);
    } else {
        const { error2 } = bodyValidate(req.body);
        if (error2)
            return res.status(400).send({ message: error2.details[0].message });

        const obj = {};
        const fields = req.body.fields;

        if (!fields)
            return res.status(400).send({ message: 'Invalid body!' })

        fields.forEach(field => obj[field] = guild[field]);
        return res.status(200).send(obj);
    }
}

router.patch('/:bot_id/:guild_id', async (req, res) => {
    const { bot_id, guild_id } = req.params;
    const { error } = idValidate({ guild_id: guild_id });
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    let guild;
    switch (bot_id) {
        case "1": {
            guild = await Guild.findOne({ server_id : Long.fromString(req.params.guild_id) });
            break;
        }
        case "2": {
            guild = await GuildTwo.findOne({ server_id : Long.fromString(req.params.guild_id) });
            break;
        }
        default: return res.status(400).json({ success: false, message: `There was no bot with the ID "${bot_id}"` });
    }

    await handleGuildPatch(req, res, guild);
})

router.patch('/:guild_id', async (req, res) => {
    const { error } = idValidate(req.params);
    if (error)
        return res.status(400).send({ message: error.details[0].message });
    
    const { error2 } = validatePATCHBody(req.body);
    if (error2)
        return res.status(400).send({ message: error2.details[0].message });

    const guild = await Guild.findOne({ server_id : Long.fromString(req.params.guild_id) });

    await handleGuildPatch(req, res, guild);
})

const handleGuildPatch = async (req, res, guild) => {
    if (!guild)
        return res.status(404).send({ message: `There was no guild found with the ID ${req.params.guild_id}`});

    let permissionsParsed;
    let restrictedChannelsParsed;
    try {
        const {
            toggles, eight_ball, theme,
            log_channel, permissions, restricted_channels,
            twenty_four_seven_mode, autoplay
        } = req.body;

        permissionsParsed = {};
        restrictedChannelsParsed = {};

        for (let key in permissions) {
            if (!(permissions[key] instanceof Array)) {
                permissionsParsed[key] = permissions[key];
                continue;
            }

            permissionsParsed[key] = permissions[key].map(val => Long.fromString(val));
        }

        for (let key in restricted_channels) {
            if (!(guild.restricted_channels[key] instanceof Array)) {
                permissionsParsed[key] = restricted_channels[key];
                continue;
            }

            restrictedChannelsParsed[key] = restricted_channels[key].map(val => Long.fromString(val));
        }

        if (toggles)
            guild.toggles = toggles;
        if (eight_ball)
            guild.eight_ball = eight_ball;
        if (theme)
            guild.theme = theme;
        if (log_channel)
            guild.log_channel = log_channel.id ? Long.fromString(log_channel.id) : '-1';
        if (permissions)
            guild.permissions = permissionsParsed;
        if (restricted_channels)
            guild.restricted_channels = restrictedChannelsParsed;
        guild.twenty_four_seven_mode = twenty_four_seven_mode;
        guild.autoplay = autoplay;
        const newGuild = await guild.save();

        const guildUnparsed = {...guild._doc};
        guildUnparsed.dedicated_channel = {
            channel_id: guild.dedicated_channel.channel_id.toString(),
            message_id: guild.dedicated_channel.message_id.toString()
        };
        guildUnparsed.server_id = guildUnparsed.server_id.toString();
        guildUnparsed.log_channel = log_channel.id;
        guildUnparsed.restricted_channels = restricted_channels;
        guildUnparsed.permissions = permissions;
        guildUnparsed.announcement_channel = guildUnparsed.announcement_channel.toString()

        guildUnparsed.banned_users = newGuild.banned_users.map(obj => ({
            banned_at: obj.banned_at.toString(),
            banned_id: obj.banned_id.toString(),
            banned_until: obj.banned_until.toString(),
            banned_by: obj.banned_by.toString()
        }));
        redis.setex(HASH_NAME + req.params.guild_id, 3600, JSON.stringify(guildUnparsed))
        res.status(200).json(newGuild);
    } catch (ex) {
        console.log(ex);
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = router;