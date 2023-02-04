import {HydratedDocument} from "mongoose";
import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";

export type GuildDocument = HydratedDocument<Guild>;
export type DedicatedChannel = {
    message_id: number,
    channel_id: number,
};

export type RestrictedChannels = {
    voice_channels: number[],
    text_channels: number[]
};

export type GuildPermissions = {
    0: number[],
    1: number[],
    2: number[],
    3: number[],
    4: number[],
    5: number[],
    users: Object
};

export type GuildToggles = {
    restricted_text_channels: boolean,
    restricted_voice_channels: boolean,
    announce_changelogs: boolean,
    "8ball": boolean,
    show_requester: boolean,
    vote_skips: boolean,
    announce_messages: boolean,
    polls: boolean,
    tips: boolean,
    global_announcements: boolean,
    log_toggles: {
        queue_add: boolean,
        track_move: boolean,
        track_loop: boolean,
        player_pause: boolean,
        track_vote_skip: boolean,
        queue_shuffle: boolean,
        player_resume: boolean,
        volume_change: boolean,
        track_seek: boolean,
        track_previous: boolean,
        track_skip: boolean,
        track_rewind: boolean,
        bot_disconnected: boolean,
        queue_remove: boolean,
        filter_toggle: boolean,
        player_stop: boolean,
        queue_loop: boolean,
        queue_clear: boolean,
        track_jump: boolean
    },
    dj_toggles: {
        "247": boolean,
        play: boolean,
        disconnect: boolean,
        favouritetracks: boolean,
        skip: boolean,
        seek: boolean,
        remove: boolean,
        karaoke: boolean,
        tremolo: boolean,
        search: boolean,
        loop: boolean,
        nightcore: boolean,
        join: boolean,
        lyrics: boolean,
        jump: boolean,
        vibrato: boolean,
        resume: boolean,
        move: boolean,
        nowplaying: boolean,
        previous: boolean,
        clear: boolean,
        skipto: boolean,
        "8d": boolean,
        pause: boolean,
        autoplay: boolean,
        volume: boolean,
        lofi: boolean,
        rewind: boolean,
        stop: boolean,
        shuffleplay: boolean,
        queue: boolean,
    }
};

export type GuildBannedUser = {
    banned_id: number,
    banned_by: number,
    banned_until: number,
    banned_at: number
};

@Schema()
export class Guild {
    @Prop(raw({
        message_id: Number,
        channel_id: Number
    }))
    dedicated_channel: DedicatedChannel;

    @Prop(raw({
        voice_channels: Array,
        text_channels: Array
    }))
    restricted_channels: RestrictedChannels;

    @Prop()
    prefix: string;

    @Prop(raw({
        0: Array,
        1: Array,
        2: Array,
        3: Array,
        4: Array,
        5: Array,
        users: Object
    }))
    permissions: GuildPermissions;

    @Prop(raw({
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
    }))
    toggles: GuildToggles;

    @Prop([String])
    eight_ball: string[];

    @Prop()
    announcement_channel: number;

    @Prop()
    theme: string;

    @Prop()
    server_id: number;

    @Prop({ type: Array })
    banned_users: GuildBannedUser[];

    @Prop()
    autoplay: boolean;

    @Prop()
    log_channel: number;

    @Prop()
    twenty_four_seven_mode: boolean;

    @Prop()
    locale: string;
}

export const GuildSchema = SchemaFactory.createForClass(Guild);