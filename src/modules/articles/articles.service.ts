import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Article } from "src/common/entities/article.entity";
import { Board } from "src/common/entities/board.entity";
import { File } from "src/common/entities/file.entity";
import { Like } from "src/common/entities/like.entity";
import { User } from "src/common/entities/user.entity";
import { DataSource } from "typeorm";
import { ArticlePageQuery } from "./dtos/article-page-query.dto";
import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly dataSource: DataSource) {}

  async createArticle(currentUser, boardId: number, createArticleDto: CreateArticleDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const board = await manager.findOne(Board, { where: { id: boardId } });
      if (!board) {
        throw new BadRequestException("There is no board with the id");
      }
      const files: File[] = [];
      for (const key of createArticleDto.fileKeys) {
        files.push(await manager.findOne(File, { where: { key: key } }));
      }

      const article = await manager.create(Article, {
        title: createArticleDto.title,
        content: createArticleDto.content,
        board: board,
        author: user,
        files: files,
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
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const article = await manager
        .createQueryBuilder(Article, "article")
        .leftJoinAndSelect("article.author", "author")
        .leftJoinAndSelect("article.board", "board")
        .leftJoinAndSelect("article.files", "file")
        .where("article.id = :id", { id: id })
        .loadRelationCountAndMap("article.userLikeCount", "article.likes", "like", (qb) =>
          qb.where("like.user_id = :id", { id: user.id })
        )
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
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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
      return Boolean((await manager.delete(Article, id)).affected);
    });
  }

  async createLike(currentUser, id, boardId) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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
        await manager.count(Like, {
          where: { user: { email: currentUser.email }, article: { id: id } },
        })
      );
      if (isLiked !== false) {
        throw new BadRequestException("Already liked");
      }
      const like = await manager.create(Like, { user: user, article: article });
      await manager.save(like);
      return true;
    });
  }

  async deleteLike(currentUser, id: number, boardId: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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
        where: { user: { email: currentUser.email }, article: { id: id } },
      });
      if (!userLike) {
        throw new BadRequestException("Not liked");
      }
      return Boolean((await manager.delete(Like, userLike.id)).affected);
    });
  }
}
