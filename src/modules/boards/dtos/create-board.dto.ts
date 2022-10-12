import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/common/entities/user.entity";

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  introduction: string;

  applicant: User;
}
