import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/common/entities/user.entity";

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  introduction: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whitelist: string[];

  applicant: User;
}
