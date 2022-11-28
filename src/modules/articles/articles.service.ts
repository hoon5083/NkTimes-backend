import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ucs2 } from "punycode";
import { Article } from "src/common/entities/article.entity";
import { Board } from "src/common/entities/board.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateArticleDto } from "./dtos/create-article.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly dataSource: DataSource) {}

  async createArticle(currentUser, boardId: number, createArticleDto: CreateArticleDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException("Pending User");
      }
      const board = await manager.findOne(Board, { where: { id: boardId } });
      if (!board) {
        throw new BadRequestException("There is no board with the id");
      }
      const article = await manager.create(Article, {
        title: createArticleDto.title,
        content: createArticleDto.content,
        board: board,
        author: user,
      });
      await manager.save(article);
      return article;
    });
  }

  async getArticles() {
    return "getArticles";
  }

  async getArticle() {
    return "getArticle";
  }

  async updateArticle() {
    return "updateArticle";
  }

  async deleteArticle() {
    return "deleteArticle";
  }

  async createLike() {
    return "createLike";
  }

  async deleteLike() {
    return "deleteLike";
  }
}
