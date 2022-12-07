import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Article } from "src/common/entities/article.entity";
import { Comment } from "src/common/entities/comment.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly dataSourcce: DataSource) {}

  async createComment(currentUser, articleId, createCommentDto: CreateCommentDto) {
    return this.dataSourcce.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      } else if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException();
      }
      const article = await manager.findOne(Article, { where: { id: articleId } });
      if (!article) {
        throw new BadRequestException("no article found");
      }
      const comment = await manager.create(Comment, {
        content: createCommentDto.content,
        article,
        author: user,
      });
      await manager.save(comment);
      return comment;
    });
  }

  async getComments() {
    return "getComments";
  }

  async deleteComment() {
    return "deleteComment";
  }
}
