import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { PostManyCommandsDto } from './dto/post-many-commands.dto';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  async postMany(@Body() postManyCommandsDto: PostManyCommandsDto) {
    return this.commandsService.putMany(postManyCommandsDto);
  }

  @Get()
  async getAll() {
    return this.commandsService.findAll();
  }

  @Get(':name')
  async getOne(@Param('name') name: string) {
    return this.commandsService.findOne(name);
  }
}
