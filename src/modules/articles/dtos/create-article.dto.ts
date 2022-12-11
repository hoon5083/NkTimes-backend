import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  fileKeys: string[];
}
