import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { UserEnum } from "src/common/enums/user.enum";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname: string;

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

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  name: string;
}

export class UpdateUserDetailDto extends UpdateUserDto {
  @IsOptional()
  @IsEnum(UserEnum)
  authority: UserEnum;

  @IsOptional()
  @IsBoolean()
  isApproved: boolean;
}
