import {DedicatedChannel, GuildBannedUser, GuildPermissions, GuildToggles, RestrictedChannels} from "../guild.schema";
import {IsObject, IsOptional, IsString} from "class-validator";
import {IsDedicatedChannel} from "../../../utils/decorators/validators/dedicated-channel.validator";

export class UpdateGuildDto {
    @IsOptional()
    @IsDedicatedChannel()
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
        each: true
    })
    eight_ball?: string[];

    @IsOptional()
    theme?: string;

    @IsOptional()
    @IsObject()
    banned_users?: GuildBannedUser[];

    @IsOptional()
    autoplay?: boolean;

    @IsOptional()
    log_channel?: number;

    @IsOptional()
    twenty_four_seven_mode?: boolean;

    @IsOptional()
    locale?: string;
}