import { IsOptional, IsString } from "class-validator";
import { PageQuery } from "src/common/dtos/pagination/page-query.dto";

export class UserPageQuery extends PageQuery {
  @IsOptional()
  @IsString()
  isPending: string;
}
