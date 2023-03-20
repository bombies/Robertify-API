import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthModule} from './routes/auth/route/auth.module';
import {AuthController} from './routes/auth/route/auth.controller';
import {AuthService} from './routes/auth/route/auth.service';
import {APP_GUARD} from '@nestjs/core';
import {JwtAuthGuard} from './routes/auth/guards/jwt-auth.guard';
import {MongooseModule} from '@nestjs/mongoose';
import {GuildModule} from './routes/guild/guild.module';
import {FavouriteTracksModule} from './routes/favourite-tracks/favourite-tracks.module';
import {MainModule} from './routes/main/main.module';
import {CommandsModule} from './routes/commands/commands.module';
import {JwtService} from '@nestjs/jwt';
import {GuildController} from './routes/guild/guild.controller';
import {CommandsController} from './routes/commands/commands.controller';
import {MainController} from './routes/main/main.controller';
import {FavouriteTracksController} from './routes/favourite-tracks/favourite-tracks.controller';
import {RedisModule} from '@liaoliaots/nestjs-redis';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    config: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                };
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`,
        ),
        ScheduleModule.forRoot(),
        AuthModule,
        GuildModule,
        FavouriteTracksModule,
        MainModule,
        CommandsModule,
    ],
    controllers: [
        AppController,
        AuthController,
        GuildController,
        CommandsController,
        MainController,
        FavouriteTracksController,
    ],
    providers: [
        AppService,
        AuthService,
        JwtService,
        {provide: APP_GUARD, useClass: JwtAuthGuard},
    ],
})
export class AppModule {
}
