import {
    DedicatedChannel,
    GuildBannedUser,
    GuildPermissions,
    GuildToggles,
    RestrictedChannels,
} from '../guild.schema';
import {IsArray, IsObject, IsOptional, IsString} from 'class-validator';
import {Types} from 'mongoose';

export class UpdateGuildDto {
    @IsOptional()
    @IsObject()
    dedicated_channel?: DedicatedChannel;

    @IsOptional()
    @IsObject()
    restricted_channels?: RestrictedChannels;

    @IsOptional()
    @IsString()
    prefix?: string;

    @IsOptional()
    @IsObject()
    permissions?: GuildPermissions;

    @IsOptional()
    @IsObject()
    toggles?: GuildToggles;

    @IsOptional()
    @IsString({
        each: true,
    })
    eight_ball?: string[];

    @IsOptional()
    theme?: string;

    @IsOptional()
    @IsArray()
    banned_users?: GuildBannedUser[];

    @IsOptional()
    autoplay?: boolean;

    @IsOptional()
    log_channel?: Types.Long;

    @IsOptional()
    twenty_four_seven_mode?: boolean;

    @IsOptional()
    locale?: string;
}
