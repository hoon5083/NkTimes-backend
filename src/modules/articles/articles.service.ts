import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Article } from "src/common/entities/article.entity";
import { Board } from "src/common/entities/board.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";

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

  async getArticle(currentUser, id: number, boardId: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException("Pending User");
      }
      const article = await manager.findOne(Article, {
        where: { id },
        relations: { author: true, files: true, board: true },
      });
      if (!article) {
        throw new NotFoundException("there is no article with the id");
      }
      if (article.board.id !== boardId) {
        throw new BadRequestException("The article is not in the board");
      }

      return article;
    });
  }

  async updateArticle(
    currentUser,
    id: number,
    boardId: number,
    updateArticleDto: UpdateArticleDto
  ) {
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
      const article = await manager.findOne(Article, {
        where: { id },
        relations: { author: true, files: true, board: true },
      });
      if (!article) {
        throw new NotFoundException("there is no article with the id");
      }
      if (article.board.id !== boardId) {
        throw new BadRequestException("The article is not in the board");
      }
      if (article.author.email !== currentUser.email) {
        throw new ForbiddenException("Not your article");
      }
      return await manager.update(Article, id, updateArticleDto);
    });
  }

  async deleteArticle(currentUser, id: number, boardId: number) {
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
      const article = await manager.findOne(Article, {
        where: { id },
        relations: { author: true, files: true, board: true },
      });
      if (!article) {
        throw new NotFoundException("there is no article with the id");
      }
      if (article.board.id !== boardId) {
        throw new BadRequestException("The article is not in the board");
      }
      if (article.author.email !== currentUser.email) {
        throw new ForbiddenException("Not your article");
      }
      return await manager.delete(Article, id);
    });
  }

  async createLike() {
    return "createLike";
  }

  async deleteLike() {
    return "deleteLike";
  }
}
