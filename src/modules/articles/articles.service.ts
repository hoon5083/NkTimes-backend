import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Article } from "src/common/entities/article.entity";
import { Board } from "src/common/entities/board.entity";
import { Like } from "src/common/entities/like.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { ArticlePageQuery } from "./dtos/article-page-query.dto";
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

  async getArticles(boardId, articlePageQuery: ArticlePageQuery) {
    return this.dataSource.transaction(async (manager) => {
      return await manager
        .createQueryBuilder(Article, "article")
        .leftJoinAndSelect("article.author", "author")
        .leftJoinAndSelect("article.board", "board")
        .where("article.board_id = :boardId", { boardId: boardId })
        .loadRelationCountAndMap("article.likeCount", "article.likes")
        .offset(articlePageQuery.getOffset())
        .limit(articlePageQuery.getLimit())
        .getManyAndCount();
    });
  }

  async getArticle(currentUser, id: number, boardId: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException("Pending User");
      }
      const article = await manager
        .createQueryBuilder(Article, "article")
        .leftJoinAndSelect("article.author", "author")
        .leftJoinAndSelect("article.board", "board")
        .leftJoinAndSelect("article.files", "file")
        .where("article.id = :id", { id: id })
        .loadRelationCountAndMap("article.likeCount", "article.likes")
        .getOne();
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
      await manager.update(Article, id, updateArticleDto);
      return Object.assign(article, updateArticleDto);
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

  async createLike(currentUser, id, boardId) {
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
      const isLiked = Boolean(
        await manager.count(Like, { where: { user: { email: currentUser.email } } })
      );
      if (isLiked !== false) {
        throw new BadRequestException("Already liked");
      }
      const like = await manager.create(Like, { user: user, article: article });
      return await manager.save(like);
    });
  }

  async deleteLike(currentUser, id: number, boardId: number) {
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
      const userLike = await manager.findOne(Like, {
        where: { user: { email: currentUser.email } },
      });
      if (!userLike) {
        throw new BadRequestException("Not liked");
      }
      return await manager.delete(Like, userLike.id);
    });
  }
}
