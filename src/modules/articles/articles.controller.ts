import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { ArticlesService } from "./articles.service";
import { ArticleDetailDto } from "./dtos/article.dto";
import { CreateArticleDto } from "./dtos/create-article.dto";

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
    return await this.articlesService.createArticle(currentUser, boardId, createArticleDto);
  }

  @Get(":boardId")
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getArticles() {
    return await this.articlesService.getArticles();
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
  async updateArticle() {
    return await this.articlesService.updateArticle();
  }

  @Delete(":boardId/:id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteArticle() {
    return await this.articlesService.deleteArticle();
  }

  @Post(":boardId/:id/like")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createLike() {
    return await this.articlesService.createLike();
  }

  @Delete(":boardId/:id/like")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteLike() {
    return await this.articlesService.deleteLike();
  }
}
