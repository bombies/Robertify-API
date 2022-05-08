const router = require('express').Router();
const Long =  require('long');
const Guild = require('../../models/Guild');
const Main = require('../../models/Main');

router.get('/', async(req, res) => {
    const guildCount = (await Main.find()).at(0)?.guild_count;
    if (!guildCount)
        return res.status(200).send({ message: "The guild count hasn't been set yet." });
    return res.status(200).send({ count: guildCount })

});

router.get('/:guild_id', async (req, res) => {
    const { error } = Guild.idValidate(req.params);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    const guild = await Guild.findOne({ server_id : Long.fromString(req.params.guild_id) });

    if (!guild)
            return res.status(400).send({ message: `There was no guild found with the ID ${req.params.guild_id}`});

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(200).send(guild);
    } else {
        const { error2 } = Guild.bodyValidate(req.body);
        if (error2)
            return res.status(400).send({ message: error2.details[0].message });
        
        const obj = {};
        const fields = req.body.fields;
        
        if (!fields)
            return res.status(400).send({ message: 'Invalid body!' })

        fields.forEach(field => obj[field] = guild[field]);
        return res.status(200).send(obj);
    }
})

module.exports = router;