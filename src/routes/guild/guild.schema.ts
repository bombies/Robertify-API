import mongoose, {HydratedDocument, Types} from "mongoose";
import mongooseLong from 'mongoose-long';
import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
mongooseLong(mongoose);

export type GuildDocument = HydratedDocument<Guild>;
export type DedicatedChannel = {
    message_id?: Types.Long | string,
    channel_id?: Types.Long | string,
    config?: {
        disconnect: boolean,
        play_pause: boolean,
        previous: boolean,
        rewind: boolean,
        stop: boolean,
        loop: boolean,
        skip: boolean,
        filters: boolean,
        favourite: boolean,
        shuffle: boolean
    },
    og_announcement_toggle?: boolean,
};

export type RestrictedChannels = {
    voice_channels?: Types.Long[] | string[],
    text_channels?: Types.Long[] | string[]
};

export type GuildPermissions = {
    0?: Types.Long[] | string[],
    1?: Types.Long[] | string[],
    2?: Types.Long[] | string[],
    3?: Types.Long[] | string[],
    4?: Types.Long[] | string[],
    5?: Types.Long[] | string[],
    users?: Object
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
    banned_id: Types.Long,
    banned_by: Types.Long,
    banned_until: Types.Long,
    banned_at: Types.Long
};

@Schema()
export class Guild {
    @Prop(raw({
        message_id: Types.Long,
        channel_id: Types.Long,
        config: Object,
        og_announcement_toggle: Boolean
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

    @Prop({ type: Types.Long })
    announcement_channel: Types.Long | string;

    @Prop()
    theme: string;

    @Prop({ type: Types.Long })
    server_id: Types.Long | string;

    @Prop({ type: Array })
    banned_users: GuildBannedUser[];

    @Prop()
    autoplay: boolean;

    @Prop({ type: Types.Long })
    log_channel: Types.Long | string;

    @Prop()
    twenty_four_seven_mode: boolean;

    @Prop()
    locale: string;
}

export const GuildSchema = SchemaFactory.createForClass(Guild);