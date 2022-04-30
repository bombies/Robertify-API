const router = require('express').Router();
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

const guildsRoute = require('./guilds/guilds');
const favouriteTracksRoute = require('./favouriteTracks');
router.use('/guilds', verify, guildsRoute);
router.use('/favtracks', verify, favouriteTracksRoute);

router.post('/login', async (req, res) => {
    const { error } = Joi.object({
        user_name: Joi.string().min(6).max(2048).required(),
        master_password: Joi.string().min(6).max(2048).required()
    }).validate(req.body);

    if (error)
        return res.status(400).send({ message: error.details[0].message });
    
    if (req.body.master_password !== process.env.MASTER_PASSWORD)
        return res.status(400).send({ message: 'Invalid credentials' });

    const token = jwt.sign({ user: req.body.user_name }, process.env.TOKEN_SECRET);
    res.status(200).send({ token: token });
})

router.get('/', (req,res) => {
    res.status(200).send({ message: 'Welcome to the Robertify API'});
});

module.exports = router;