import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import mongooseLong from 'mongoose-long';
import { Guild, GuildBannedUser, GuildDocument } from './guild.schema';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { GuildRedisManager } from './guild.redis-manager';
import { BotWebClient } from 'src/utils/webclients/BotWebClient';
mongooseLong(mongoose);

@Injectable()
export class GuildService {
  private readonly redisManager: GuildRedisManager;

  constructor(
    @InjectModel('guilds') private readonly guildModel: Model<GuildDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.redisManager = new GuildRedisManager(redis);
  }

  async findOne(id: string) {
    return this.rawFindGuild(id);
  }

  async updateOne(id: string, updateGuildDto: UpdateGuildDto) {
    const guild = await this.rawFindGuild(id);
    return this.rawUpdateGuild(guild, updateGuildDto);
  }

  async deleteOne(id: string) {
    return this.rawRemoveGuild(id);
  }

  async findAll() {
    // TODO look into API pagination
  }

  private async rawFindGuild(id: string) {
    let cachedGuild = await this.redisManager.findOne(id);
    if (!cachedGuild) {
      const guild = await this.guildModel
        .findOne({ server_id: { $in: [id, Types.Long.fromString(id)] } })
        .exec();
      if (!guild)
        throw new HttpException(
          'There is no guild with the id: ' + id,
          HttpStatus.NOT_FOUND,
        );
      // @ts-ignore
      cachedGuild = GuildService.getSafeGuild(guild._doc);
      await this.redisManager.putOne(cachedGuild);
    }
    return GuildService.getSafeGuild(cachedGuild);
  }

  public static getSafeGuild(guild: Guild) {
    const retGuild = { ...guild };
    const dedicatedChannelParsed = {};
    const permissionsParsed = {};
    const restrictedChannelsParsed = {};

    for (const key in guild.dedicated_channel) {
      if (key !== 'message_id' && key !== 'channel_id')
        dedicatedChannelParsed[key] = guild.dedicated_channel[key];
      else
        dedicatedChannelParsed[key] = guild.dedicated_channel[key].toString();
    }

    for (const key in guild.permissions) {
      if (!(guild.permissions[key] instanceof Array)) {
        permissionsParsed[key] = guild.permissions[key];
        continue;
      }

      permissionsParsed[key] = guild.permissions[key].map((val) =>
        val.toString(),
      );
    }

    for (const key in guild.restricted_channels) {
      if (!(guild.restricted_channels[key] instanceof Array)) {
        permissionsParsed[key] = guild.restricted_channels[key];
        continue;
      }

      restrictedChannelsParsed[key] = guild.restricted_channels[key].map(
        (val) => val.toString(),
      );
    }

    const bannedUsers: GuildBannedUser[] = guild.banned_users.map((user) => {
      user.banned_at = user.banned_at.toString();
      user.banned_by = user.banned_by.toString();
      user.banned_until = user.banned_until.toString();
      user.banned_id = user.banned_id.toString();
      return user;
    });

    retGuild.server_id = guild.server_id.toString();
    retGuild.dedicated_channel = dedicatedChannelParsed;
    retGuild.permissions = permissionsParsed;
    retGuild.restricted_channels = restrictedChannelsParsed;
    retGuild.announcement_channel = guild.announcement_channel.toString();
    retGuild.log_channel = guild.log_channel
      ? guild.log_channel.toString()
      : null;
    retGuild.banned_users = bannedUsers;
    retGuild.locale ??= 'english';

    return retGuild;
  }

  private async rawRemoveGuild(id: string) {
    return this.guildModel
      .deleteOne({ server_id: Types.Long.fromString(id) })
      .exec()
      .then(async (result) => {
        if (result.deletedCount > 0) await this.redisManager.deleteOne(id);
        return result;
      });
  }

  private async rawUpdateGuild(guild: Guild, updateGuildDto: UpdateGuildDto) {
    // Prelim Checks
    if (typeof guild.server_id === 'string')
      guild.server_id = Types.Long.fromString(guild.server_id as string);
    if (typeof guild.log_channel === 'string')
      guild.log_channel = Types.Long.fromString(guild.log_channel as string);
    if (typeof updateGuildDto.log_channel === 'string')
      updateGuildDto.log_channel = Types.Long.fromString(
        updateGuildDto.log_channel as string,
      );
    if (updateGuildDto.dedicated_channel) {
      if (typeof updateGuildDto.dedicated_channel.channel_id === 'string')
        updateGuildDto.dedicated_channel.channel_id = Types.Long.fromString(
          updateGuildDto.dedicated_channel.channel_id as string,
        );
      if (typeof updateGuildDto.dedicated_channel.message_id === 'string')
        updateGuildDto.dedicated_channel.message_id = Types.Long.fromString(
          updateGuildDto.dedicated_channel.message_id as string,
        );
    }
    if (updateGuildDto.restricted_channels) {
      for (const key in updateGuildDto.restricted_channels) {
        if (guild.restricted_channels[key] instanceof Array)
          updateGuildDto.restricted_channels[key] =
            updateGuildDto.restricted_channels[key].map((val) => {
              if (typeof val === 'string')
                return Types.Long.fromString(val as string);
              else return val;
            });
      }
    }
    if (updateGuildDto.permissions) {
      for (const key in updateGuildDto.permissions) {
        if (guild.permissions[key] instanceof Array)
          updateGuildDto.permissions[key] = updateGuildDto.permissions[key].map(
            (val) => {
              if (typeof val === 'string')
                return Types.Long.fromString(val as string);
              else return val;
            },
          );
      }
    }
    if (updateGuildDto.banned_users) {
      updateGuildDto.banned_users = updateGuildDto.banned_users.map(
        (bannedUser) => {
          bannedUser.banned_at =
            typeof bannedUser.banned_at === 'string'
              ? Types.Long.fromString(bannedUser.banned_at)
              : bannedUser.banned_at;
          bannedUser.banned_by =
            typeof bannedUser.banned_by === 'string'
              ? Types.Long.fromString(bannedUser.banned_by)
              : bannedUser.banned_by;
          bannedUser.banned_until =
            typeof bannedUser.banned_until === 'string'
              ? Types.Long.fromString(bannedUser.banned_until)
              : bannedUser.banned_until;
          bannedUser.banned_id =
            typeof bannedUser.banned_id === 'string'
              ? Types.Long.fromString(bannedUser.banned_id)
              : bannedUser.banned_id;
          return bannedUser;
        },
      );
    }

    if (updateGuildDto.locale) {
      const botWebClient = await BotWebClient.getInstance();
      await botWebClient.post('/locale', {
        server_id: guild.server_id.toString(),
        locale: updateGuildDto.locale,
      });
      guild.locale = updateGuildDto.locale;
    }

    if (updateGuildDto.theme) {
      const botWebClient = await BotWebClient.getInstance();
      await botWebClient.post('/themes', {
        server_id: guild.server_id.toString(),
        theme: updateGuildDto.theme,
      });
      guild.theme = updateGuildDto.theme;
    }

    guild.twenty_four_seven_mode =
      updateGuildDto.twenty_four_seven_mode ??
      guild.twenty_four_seven_mode ??
      false;
    guild.autoplay = updateGuildDto.autoplay ?? guild.autoplay ?? false;
    guild.prefix = updateGuildDto.prefix ?? guild.prefix;
    guild.banned_users = updateGuildDto.banned_users ?? guild.banned_users;
    guild.dedicated_channel =
      updateGuildDto.dedicated_channel ?? guild.dedicated_channel;
    guild.eight_ball = updateGuildDto.eight_ball ?? guild.eight_ball;
    guild.log_channel = updateGuildDto.log_channel ?? guild.log_channel;
    guild.permissions = updateGuildDto.permissions ?? guild.permissions;
    guild.restricted_channels =
      updateGuildDto.restricted_channels ?? guild.restricted_channels;
    guild.toggles = updateGuildDto.toggles ?? guild.toggles;

    if (Object.keys(guild).includes('_id'))
      // @ts-ignore
      delete guild._id;

    return this.guildModel
      .updateOne(
        { server_id: { $in: [guild.server_id, guild.server_id.toString()] } },
        guild,
      )
      .exec()
      .then(async (result) => {
        await this.redisManager.putOne(guild);
        return result;
      });
  }
}
