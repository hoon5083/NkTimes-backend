import { PageDto } from "src/common/dtos/pagination/page.dto";
import { Comment } from "src/common/entities/comment.entity";
import { CommentDto } from "./comment.dto";

export class CommentPageDto extends PageDto<CommentDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, comments: Comment[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      comments.map((comment) => {
        return new CommentDto(comment);
      })
    );
  }
}
