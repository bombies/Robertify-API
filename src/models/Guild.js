const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: { Long } } = mongoose;

const idValidate = (data) => {
    const validation = Joi.object({
        guild_id: Joi.string().regex(/^[0-9]{17,18}$/).required()
    });
    return validation.validate(data);
}

const bodyValidate = (data) => {
    const validation = Joi.object({
        fields: Joi.array().items(Joi.string().max(128)).required()
    });
    return validation.validate(data);
}

const schema = mongoose.Schema({
    dedicated_channel: {
        message_id: Long,
        channel_id: Long
    },
    restricted_channels: {
        voice_channels: Array,
        text_channels: Array
    },
    prefix: String,
    permissions: {
        0: Array,
        1: Array,
        2: Array,
        3: Array,
        4: Array,
        5: Array,
        users: Object
    },
    toggles: {
        restricted_text_channels: Boolean,
        restricted_voice_channels: Boolean,
        announce_changelogs: Boolean,
        "8ball": Boolean,
        show_requester: Boolean,
        vote_skips: Boolean,
        announce_messages: Boolean,
        polls: Boolean,
        tips: Boolean,
        global_announcements: Boolean,
        log_toggles: {
            queue_add: Boolean,
            track_move: Boolean,
            track_loop: Boolean,
            player_pause: Boolean,
            track_vote_skip: Boolean,
            queue_shuffle: Boolean,
            player_resume: Boolean,
            volume_change: Boolean,
            track_seek: Boolean,
            track_previous: Boolean,
            track_skip: Boolean,
            track_rewind: Boolean,
            bot_disconnected: Boolean,
            queue_remove: Boolean,
            filter_toggle: Boolean,
            player_stop: Boolean,
            queue_loop: Boolean,
            queue_clear: Boolean,
            track_jump: Boolean
        },
        dj_toggles: {
            "247": Boolean,
            play: Boolean,           
            disconnect: Boolean,           
            favouritetracks: Boolean,           
            skip: Boolean,           
            seek: Boolean,           
            remove: Boolean,           
            karaoke: Boolean,           
            tremolo: Boolean,           
            search: Boolean,           
            loop: Boolean,           
            nightcore: Boolean,           
            join: Boolean,           
            lyrics: Boolean,           
            jump: Boolean,           
            vibrato: Boolean,           
            resume: Boolean,           
            move: Boolean,           
            nowplaying: Boolean,           
            previous: Boolean,           
            clear: Boolean,           
            skipto: Boolean,           
            "8d": Boolean,           
            pause: Boolean,           
            autoplay: Boolean,           
            volume: Boolean,           
            lofi: Boolean,           
            rewind: Boolean,           
            stop: Boolean,           
            shuffleplay: Boolean,           
            queue: Boolean,           
        }
    },
    eight_ball: Array,
    announcement_channel: Long,
    theme: String,
    server_id: Long,
    banned_users: Array,
    autoplay: Boolean,
    log_channel: Long,
    twenty_four_seven_mode: Boolean
});

module.exports = mongoose.model('Guilds', schema);
module.exports.idValidate = idValidate;
module.exports.bodyValidate = bodyValidate;