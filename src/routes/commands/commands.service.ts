import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandDocument } from './command.schema';
import { PostCommandDto } from './dto/post-command.dto';
import { PostManyCommandsDto } from './dto/post-many-commands.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { CommandsRedisManager } from './commands.redis-manager';

@Injectable()
export class CommandsService {
  private readonly redisManager: CommandsRedisManager;

  constructor(
    @InjectModel('commands')
    private readonly commandsModel: Model<CommandDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.redisManager = new CommandsRedisManager(redis);
  }

  async findOne(name: string) {
    return this.findOneRaw(name);
  }

  async findMany(names: string[]) {
    return this.findManyRaw(names);
  }

  async findAll() {
    return this.commandsModel.find().exec();
  }

  async putOne(postCommandDto: PostCommandDto) {
    const existingCommand = await this.findOneRaw(postCommandDto.name);
    if (existingCommand)
      throw new HttpException(
        'There is already a command with the name: ' + postCommandDto.name,
        HttpStatus.BAD_REQUEST,
      );
    postCommandDto.description ??= '';
    return new this.commandsModel(postCommandDto).save();
  }

  async putMany(postManyCommandsDto: PostManyCommandsDto) {
    await this.deleteManyRaw(postManyCommandsDto.commands.map((e) => e.name));
    return this.commandsModel.insertMany(postManyCommandsDto.commands);
  }

  async updateOne(id: number, updateCommandDto: UpdateCommandDto) {
    const command = await this.findOneRawById(id);
    if (!command)
      throw new HttpException(
        'There is no such command with id: ' + id,
        HttpStatus.NOT_FOUND,
      );
    return this.updateOneRaw(command, updateCommandDto);
  }

  private async findOneRaw(name: string) {
    let cachedCommand = await this.redisManager.findOne(name);
    if (!cachedCommand) {
      const dbCommand = await this.commandsModel.findOne({ name: name }).exec();
      if (!dbCommand)
        throw new HttpException(
          'There is no command with the name: ' + name,
          HttpStatus.NOT_FOUND,
        );
      cachedCommand = dbCommand;
      await this.redisManager.putOne(cachedCommand);
    }
    return cachedCommand;
  }

  private async findOneRawById(id: number) {
    let cachedCommand = await this.redisManager.findOneById(id);
    if (!cachedCommand) {
      const dbCommand = await this.commandsModel.findOne({ id: id }).exec();
      if (!dbCommand)
        throw new HttpException(
          'There is no command with the id: ' + id,
          HttpStatus.NOT_FOUND,
        );
      cachedCommand = dbCommand;
      await this.redisManager.putOne(cachedCommand);
    }
    return cachedCommand;
  }

  private async findManyRaw(names: string[]) {
    const cachedCommands = await this.redisManager.findMany(names);
    const commandsToFind = [];
    const validCommands = [];
    cachedCommands.forEach((command, key) => {
      if (!command) commandsToFind.push(key);
      else validCommands.push(command);
    });

    const dbCommands = await this.commandsModel
      .find({ name: { $in: names } })
      .exec();
    dbCommands.forEach((command) => validCommands.push(command));
    return validCommands;
  }

  private async updateOneRaw(
    command: Command,
    updateCommandDto: UpdateCommandDto,
  ) {
    command.name = updateCommandDto.name ?? command.name;
    command.description = updateCommandDto.description ?? command.description;
    command.category = updateCommandDto.description ?? command.description;
    return this.commandsModel
      .updateOne({ id: command.id }, command)
      .exec()
      .then(async (result) => {
        if (result.modifiedCount > 0) await this.redisManager.putOne(command);
        return result;
      });
  }

  private async deleteOneRaw(name: string) {
    return this.commandsModel
      .deleteOne({ name: name })
      .exec()
      .then(async (result) => {
        if (result.deletedCount > 0) await this.redisManager.deleteOne(name);
        return result;
      });
  }

  private async deleteManyRaw(names: string[]) {
    return this.commandsModel
      .deleteMany({ name: { $in: names } })
      .exec()
      .then(async (result) => {
        if (result.deletedCount > 0)
          for (const name in names)
            if (await this.redisManager.findOne(name))
              await this.redisManager.deleteOne(name);
      });
  }
}
