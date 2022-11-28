import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}
