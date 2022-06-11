const router = require('express').Router();
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const guildsRoute = require('./guilds/guilds');
const favouriteTracksRoute = require('./favouriteTracks');
const commandsRoute = require('./commands/commands');
const premiumRoute = require('./premium/premium');
const verify = require('./verifyToken');

router.use('/guilds', verify, guildsRoute);
router.use('/favtracks', verify, favouriteTracksRoute);
router.use('/commands', verify, commandsRoute);
router.use('/premium', verify, premiumRoute);

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
    res.status(200).send({ message: 'Welcome to the Robertify API 🎉'});
});

const verifyHMACSignature = (key) => {
    return function(req, res, next) {
        const hash = req.header["x-patreon-signature"],
            hmac = crypto.createHmac("md5", key);

        req.on("data", function(data) {
            hmac.update(data);
        });

        req.on("end", function() {
            const crypted = hmac.digest("hex");

            if(crypted === hash) {
                // Valid request
                return res.status(200).send("Success!");
            } else {
                // Invalid request
                return res.status(403).send("Invalid TrialPay hash");
            }
        });

        req.on("error", function(err) {
            return next(err);
        });
    }
}

module.exports = router;
module.exports.verifyHMACSignature = verifyHMACSignature;