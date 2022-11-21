import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class ArticlesService {
  constructor(private readonly dataSource: DataSource) {}

  async createArticle() {
    return "createArticle";
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
