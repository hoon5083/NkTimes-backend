import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/common/entities/user.entity";

export class CreateTalkingDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  author: User;
}
