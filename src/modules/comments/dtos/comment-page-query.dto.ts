import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { PageQuery } from "src/common/dtos/pagination/page-query.dto";

export class CommentPageQuery extends PageQuery {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  articleId: number;
}
