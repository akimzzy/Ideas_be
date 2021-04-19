import { IsNotEmpty, IsString } from 'class-validator';
import { IdeaEntity } from 'src/idea/idea.entity';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  ideas: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}
