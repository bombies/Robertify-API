import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import MongooseLong from 'mongoose-long';

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
    @Prop()
    dedicated_channel: DedicatedChannel;

    @Prop()
    restricted_channels: RestrictedChannels;

    @Prop()
    prefix: string;

    @Prop()
    permissions: GuildPermissions;

    @Prop()
    toggles: GuildToggles;

    @Prop([String])
    eight_ball: string[];

    @Prop()
    announcement_channel: number;

    @Prop()
    theme: string;

    @Prop()
    server_id: number;

    @Prop()
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