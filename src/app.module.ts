import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/route/auth.module';
import {AuthController} from "./auth/route/auth.controller";
import {AuthService} from "./auth/route/auth.service";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {MongooseModule} from "@nestjs/mongoose";
import { GuildService } from './guild/guild.service';
import { GuildModule } from './guild/guild.module';
import { SModule } from './favourite-tracks/s/s.module';
import { FavouriteTracksModule } from './favourite-tracks/favourite-tracks.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`),
      AuthModule,
      GuildModule,
      SModule,
      FavouriteTracksModule
  ],
  controllers: [AppController, AuthController],
  providers: [
      AppService,
      AuthService,
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      GuildService
  ],
})
export class AppModule {}
