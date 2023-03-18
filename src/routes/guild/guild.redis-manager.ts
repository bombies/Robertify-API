import { RedisManager } from '../../utils/redis/redis-manager';
import Redis from 'ioredis';
import { Guild } from './guild.schema';
import { GuildService } from './guild.service';
import { Types } from 'mongoose';

export class GuildRedisManager extends RedisManager {
  constructor(redis: Redis) {
    super(redis, 'ROBERTIFY_GUILD');
  }

  public async putOne(guild: Guild) {
    const safeGuild = GuildService.getSafeGuild(guild);
    return this.setex(safeGuild.server_id as string, safeGuild, 3600);
  }

  public async findAll() {
    return this.getAll<Guild>();
  }

  public async findOne(id: string | Types.Long) {
    const safeId = id.toString();
    return this.get<Guild>(safeId);
  }

  public async findMany(ids: string[] | Types.Long[]) {
    const safeIds: string[] = ids.map((id) => id.toString());
    return this.mget<Guild>(safeIds);
  }

  public async deleteOne(id: string | Types.Long) {
    const safeId = id.toString();
    return this.del(safeId);
  }
}
