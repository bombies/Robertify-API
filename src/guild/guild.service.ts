import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Guild, GuildDocument} from "./guild.schema";
import {UpdateGuildDto} from "./dto/update-guild.dto";

@Injectable()
export class GuildService {
    constructor(@InjectModel('guilds') private readonly guildModel: Model<GuildDocument>) {}

    async findOne(id: number) {
        return this.rawFindGuild(id);
    }

    async updateOne(id: number, updateGuildDto: UpdateGuildDto) {
        const guild = await this.rawFindGuild(id);
        return this.rawUpdateGuild(guild, updateGuildDto);
    }

    async deleteOne(id: number) {
        return this.rawRemoveGuild(id);
    }

    async findAll() {
        // TODO look into API pagination
    }

    private async rawFindGuild(id: number) {
        return this.guildModel.findOne({ server_id: id }).exec();
    }

    private async rawRemoveGuild(id: number) {
        return this.guildModel.deleteOne({ server_id: id }).exec();
    }

    private async rawUpdateGuild(guild: Guild, updateGuildDto: UpdateGuildDto) {
        if (updateGuildDto.twenty_four_seven_mode)
            guild.twenty_four_seven_mode = updateGuildDto.twenty_four_seven_mode;
        if (updateGuildDto.autoplay)
            guild.autoplay = updateGuildDto.autoplay;
        if (updateGuildDto.locale)
            guild.locale = updateGuildDto.locale;
        if (updateGuildDto.prefix)
            guild.prefix = updateGuildDto.prefix;
        if (updateGuildDto.theme)
            guild.theme = updateGuildDto.theme;
        if (updateGuildDto.banned_users)
            guild.banned_users = updateGuildDto.banned_users;
        if (updateGuildDto.dedicated_channel)
            guild.dedicated_channel = updateGuildDto.dedicated_channel;
        if (updateGuildDto.eight_ball)
            guild.eight_ball = updateGuildDto.eight_ball;
        if (updateGuildDto.log_channel)
            guild.log_channel = updateGuildDto.log_channel;
        if (updateGuildDto.permissions)
            guild.permissions = updateGuildDto.permissions;
        if (updateGuildDto.restricted_channels)
            guild.restricted_channels = updateGuildDto.restricted_channels;
        if (updateGuildDto.toggles)
            guild.toggles = updateGuildDto.toggles;
        return this.guildModel.updateOne({ server_id: guild.server_id }, guild).exec();
    }
}
