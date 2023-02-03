import {Controller, Post, UseGuards} from '@nestjs/common';
import {Public} from "../public.decorator";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login() {
        return this.authService.login()

    }
}
