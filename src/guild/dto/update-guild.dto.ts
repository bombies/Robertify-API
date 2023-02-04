import {DedicatedChannel, GuildBannedUser, GuildPermissions, GuildToggles, RestrictedChannels} from "../guild.schema";

export class UpdateGuildDto {
    dedicated_channel?: DedicatedChannel;
    restricted_channels?: RestrictedChannels;
    prefix?: string;
    permissions?: GuildPermissions;
    toggles?: GuildToggles;
    eight_ball?: string[];
    theme?: string;
    banned_users?: GuildBannedUser[];
    autoplay?: boolean;
    log_channel?: number;
    twenty_four_seven_mode?: boolean;
    locale?: string;
}