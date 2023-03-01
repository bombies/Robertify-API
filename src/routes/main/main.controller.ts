import {Controller, Get} from '@nestjs/common';
import {MainService} from "./main.service";

@Controller('main')
export class MainController {
    constructor(private readonly mainService: MainService) {}

    @Get()
    async getGuildCount() {
        return this.mainService.find().then(payload => payload.guild_count);
    }

}
