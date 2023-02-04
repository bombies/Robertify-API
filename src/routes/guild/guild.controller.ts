import {Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import {GuildService} from "./guild.service";

@Controller('guild')
export class GuildController {
    constructor(private readonly guildService: GuildService) {}

    @Get(':id')
    async getGuild(@Param('id') id: string) {
        return await this.guildService.findOne(id);
    }

}
