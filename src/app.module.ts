import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/route/auth.module';
import {AuthController} from "./auth/route/auth.controller";
import {AuthService} from "./auth/route/auth.service";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      AuthModule
  ],
  controllers: [AppController, AuthController],
  providers: [
      AppService,
      AuthService,
      { provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
})
export class AppModule {}
