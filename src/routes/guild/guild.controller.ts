import {Body, Controller, Get, Patch, Param, HttpException} from '@nestjs/common';
import {GuildService} from './guild.service';
import {UpdateGuildDto} from './dto/update-guild.dto';
import {AxiosError} from 'axios';
import {HttpStatus} from '@nestjs/common/enums';

@Controller('guild')
export class GuildController {
    constructor(private readonly guildService: GuildService) {
    }

    @Get(':id')
    async getGuild(@Param('id') id: string) {
        return await this.guildService.findOne(id);
    }

    @Patch(':id')
    async updateGuild(@Param('id') id: string, @Body() body: UpdateGuildDto) {
        try {
            return await this.guildService.updateOne(id, body);
        } catch (e) {
            if (e instanceof AxiosError)
                throw new HttpException(e.message, e.status ?? 401, {cause: e});
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR, {cause: e})
        }
    }
}
