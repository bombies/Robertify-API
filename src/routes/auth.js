const router = require('express').Router();

const guildsRoute = require('./guilds/guilds');
const favouriteTracksRoute = require('./favouriteTracks');
router.use('/guilds', guildsRoute);
router.use('/favtracks', favouriteTracksRoute);

router.get('/', (req,res) => {
    res.status(200).send({ message: 'Welcome to the Robertify API'});
});

module.exports = router;