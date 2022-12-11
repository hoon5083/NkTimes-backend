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
import { CommentPageQuery } from "./dtos/comment-page-query.dto";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly dataSource: DataSource) {}

  async createComment(currentUser, articleId: number, createCommentDto: CreateCommentDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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

  async getComments(currentUser, commentPageQuery: CommentPageQuery) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      return await manager.findAndCount(Comment, {
        where: { article: { id: commentPageQuery.articleId } },
        relations: {
          article: true,
          author: true,
        },
        take: commentPageQuery.getLimit(),
        skip: commentPageQuery.getOffset(),
      });
    });
  }

  async deleteComment(currentUser, id: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const comment = await manager.findOne(Comment, {
        where: { id: id },
        relations: { author: true },
      });
      if (comment.isDeleted) {
        throw new BadRequestException("not exist");
      } else if (user.id !== comment.author.id && user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("not your comment");
      }
      comment.isDeleted = true;
      return Boolean((await manager.update(Comment, id, comment)).affected);
    });
  }
}
