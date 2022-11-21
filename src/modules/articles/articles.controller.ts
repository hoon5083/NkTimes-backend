import { Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { ArticlesService } from "./articles.service";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post(":boardId")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createArticle() {
    return await this.articlesService.createArticle();
  }

  @Get(":boardId")
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getArticles() {
    return await this.articlesService.getArticles();
  }

  @Get(":boardId/:id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async getArticle() {
    return await this.articlesService.getArticle();
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
