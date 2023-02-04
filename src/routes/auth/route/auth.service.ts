import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as process from "process";

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}


    public validateMasterPassword(password: string) {
        return password === process.env.MASTER_PASSWORD;
    }

    async login() {
        return { access_token: this.jwtService.sign({ sub: 'admin' }, { secret: process.env.API_SECRET_KEY }) };
    }
}
