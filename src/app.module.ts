import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './routes/auth/route/auth.module';
import {AuthController} from "./routes/auth/route/auth.controller";
import {AuthService} from "./routes/auth/route/auth.service";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./routes/auth/guards/jwt-auth.guard";
import {MongooseModule} from "@nestjs/mongoose";
import { GuildModule } from './routes/guild/guild.module';
import { FavouriteTracksModule } from './routes/favourite-tracks/favourite-tracks.module';
import { MainModule } from './routes/main/main.module';
import { CommandsModule } from './routes/commands/commands.module';
import {JwtService} from "@nestjs/jwt";
import {GuildController} from "./routes/guild/guild.controller";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`),
      AuthModule,
      GuildModule,
      FavouriteTracksModule,
      MainModule,
      CommandsModule
  ],
  controllers: [AppController, AuthController, GuildController],
  providers: [
      AppService,
      AuthService,
      JwtService,
      { provide: APP_GUARD, useClass: JwtAuthGuard }
  ]
})
export class AppModule {}
