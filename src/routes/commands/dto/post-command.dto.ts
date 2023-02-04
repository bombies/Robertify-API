import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class PostCommandDto {
    @IsNotEmpty()
    @IsNumber()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    category: string;
}