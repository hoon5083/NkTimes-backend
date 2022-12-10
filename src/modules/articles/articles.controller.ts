import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { SuccessDto } from "src/common/dtos/success.dto";
import { ArticlesService } from "./articles.service";
import { ArticlePageQuery } from "./dtos/article-page-query.dto";
import { ArticlePageDto } from "./dtos/article-page.dto";
import { ArticleDetailDto } from "./dtos/article.dto";
import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post(":boardId")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createArticle(
    @CurrentUser() currentUser,
    @Param("boardId", ParseIntPipe) boardId: number,
    @Body() createArticleDto: CreateArticleDto
  ) {
    return new ArticleDetailDto(
      await this.articlesService.createArticle(currentUser, boardId, createArticleDto)
    );
  }

  @Get(":boardId")
  async getArticles(
    @Query() articlePageQuery: ArticlePageQuery,
    @Param("boardId") boardId: number
  ) {
    const [articles, count] = await this.articlesService.getArticles(boardId, articlePageQuery);
    return new ArticlePageDto(
      count,
      articlePageQuery.getLimit(),
      articlePageQuery.pageNumber,
      articles
    );
  }

  @Get(":boardId/:id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async getArticle(
    @CurrentUser() currentUser,
    @Param("id", ParseIntPipe) id: number,
    @Param("boardId", ParseIntPipe) boardId: number
  ) {
    return new ArticleDetailDto(await this.articlesService.getArticle(currentUser, id, boardId));
  }

  @Patch(":boardId/:id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async updateArticle(
    @CurrentUser() currentUser,
    @Param("boardId") boardId: number,
    @Param("id") id: number,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return new ArticleDetailDto(
      await this.articlesService.updateArticle(currentUser, id, boardId, updateArticleDto)
    );
  }

  @Delete(":boardId/:id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteArticle(
    @CurrentUser() currentUser,
    @Param("boardId") boardId: number,
    @Param("id") id: number
  ) {
    return new SuccessDto(await this.articlesService.deleteArticle(currentUser, id, boardId));
  }

  @Post(":boardId/:id/like")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createLike(
    @CurrentUser() currentUser,
    @Param("boardId") boardId: number,
    @Param("id") id: number
  ) {
    return await this.articlesService.createLike(currentUser, id, boardId);
  }

  @Delete(":boardId/:id/like")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteLike(
    @CurrentUser() currentUser,
    @Param("boardId") boardId: number,
    @Param("id") id: number
  ) {
    return await this.articlesService.deleteLike(currentUser, id, boardId);
  }
}
