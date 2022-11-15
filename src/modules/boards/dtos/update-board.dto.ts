import { IsBoolean, IsOptional } from "class-validator";
import { CreateBoardDto } from "./create-board.dto";

export class UpdateBoardDto extends CreateBoardDto {
  @IsOptional()
  @IsBoolean()
  isApproved: boolean;
}
