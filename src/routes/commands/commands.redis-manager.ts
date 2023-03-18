import { RedisManager } from '../../utils/redis/redis-manager';
import Redis from 'ioredis';
import { Command } from './command.schema';

export class CommandsRedisManager extends RedisManager {
  constructor(redis: Redis) {
    super(redis, 'robertifyCommandHash');
  }

  public async putOne(command: Command) {
    return this.setex(command.name, command, 300);
  }

  public async findAll() {
    return this.getAll<Command>();
  }

  public async findOne(name: string) {
    return this.get<Command>(name);
  }

  public async findOneById(id: number) {
    const cachedCommands = await this.findAll();
    return cachedCommands.find((command) => command.id == id);
  }

  public async findMany(names: string[]) {
    return this.mget<Command>(names);
  }

  public async deleteOne(name: string) {
    return this.del(name);
  }
}
