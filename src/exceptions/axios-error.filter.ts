import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import { Request, Response } from 'express';
import {AxiosError} from "axios";

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter<AxiosError> {

    catch(exception: AxiosError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.response.status ?? 401;

        response
            .status(status)
            .json(exception.response.data);
    }

}