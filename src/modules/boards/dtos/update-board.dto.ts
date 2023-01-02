import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  introduction: string;

  @IsOptional()
  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whitelist: string[];
}
