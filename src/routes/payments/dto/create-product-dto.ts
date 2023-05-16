import {IsIn, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    @Length(1,127)
    name: string;

    @IsOptional()
    @Length(1, 256)
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['PHYSICAL', 'DIGITAL', 'SERVICE'])
    type: string

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    @Length(1, 2000)
    image_url: string

    @IsOptional()
    @IsString()
    @Length(1, 2000)
    home_url: string
}