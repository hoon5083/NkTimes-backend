import { AuthorDto } from "src/common/dtos/author.dto";
import { Comment } from "src/common/entities/comment.entity";

export class CommentDto {
  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = this.isDeleted ? null : comment.content;
    this.articleId = comment.article.id;
    this.isDeleted = comment.isDeleted;
    this.createdAt = comment.createdAt;
    this.author = this.isDeleted ? null : new AuthorDto(comment.author);
  }
  id: number;
  content: string;
  articleId: number;
  isDeleted: boolean;
  createdAt: Date;
  author: AuthorDto;
}
