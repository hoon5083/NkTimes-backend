import { IsInt, IsNotEmpty } from "class-validator";
import { PageQuery } from "src/common/dtos/pagination/page-query.dto";

export class CommentPageQuery extends PageQuery {
  @IsNotEmpty()
  @IsInt()
  articleId: number;
}
