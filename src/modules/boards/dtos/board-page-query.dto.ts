import { IsOptional, IsString } from "class-validator";
import { PageQuery } from "src/common/dtos/pagination/page-query.dto";

export class BoardPageQuery extends PageQuery {
  @IsOptional()
  @IsString()
  isApproved: string;
}
