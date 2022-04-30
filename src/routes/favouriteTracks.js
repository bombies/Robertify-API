const router = require('express').Router();
const Long = require('long');
const FavouriteTracks = require('../models/FavouriteTracks');

router.get('/:userId', async (req, res) => {
    const regex = /^[0-9]{18}$/;
    if (!regex.exec(req.params.userId))
        return res.status(400).send({ message: 'Invalid ID!'});
    
    const userInfo = await FavouriteTracks.findOne({ user_id: Long.fromString(req.params.userId) })
    if (!userInfo)
        return res.status(400).send({ message: `There was no information found for user with ID ${req.params.userId}` });
    return res.status(200).send(userInfo.tracks);
})

module.exports = router;