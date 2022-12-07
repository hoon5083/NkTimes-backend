import { AuthorDto } from "src/common/dtos/author.dto";
import { Comment } from "src/common/entities/comment.entity";

export class CommentDto {
  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.articleId = comment.article.id;
    this.createdAt = comment.createdAt;
    this.author = new AuthorDto(comment.author);
  }
  id: number;
  content: string;
  articleId: number;
  createdAt: Date;
  author: AuthorDto;
}
