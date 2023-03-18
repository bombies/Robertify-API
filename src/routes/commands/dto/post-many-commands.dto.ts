import { PostCommandDto } from './post-command.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PostManyCommandsDto {
  @IsNotEmpty()
  @IsArray()
  commands: PostCommandDto[];
}
