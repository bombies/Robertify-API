import {Controller, Get, UseFilters} from '@nestjs/common';
import { AppService } from './app.service';
import {AxiosErrorFilter} from "./exceptions/axios-error.filter";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
