import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { CreateBoardDto } from "./create-board.dto";

export class UpdateBoardDto extends CreateBoardDto {
  @IsOptional()
  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whitelist: string[];
}
