import {
  IsEnum,
  IsInt,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { UserEnum } from "src/common/enums/user.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEnum(UserEnum)
  authority: UserEnum;

  @IsOptional()
  @IsInt()
  @IsPositive()
  grade: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  class: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  studentId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  phone: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
