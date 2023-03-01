import {Body, Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import {GuildService} from "./guild.service";
import {UpdateGuildDto} from "./dto/update-guild.dto";

@Controller('guild')
export class GuildController {
    constructor(private readonly guildService: GuildService) {}

    @Get(':id')
    async getGuild(@Param('id') id: string) {
        return await this.guildService.findOne(id);
    }

    @Get(':id')
    async updateGuild(@Param('id') id: string, @Body() body: UpdateGuildDto) {
        return await this.guildService.updateOne(id, body);
    }

}
