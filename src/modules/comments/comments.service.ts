import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class CommentsService {
  constructor(private readonly dataSourcce: DataSource) {}

  async createComment() {
    return "createComment";
  }

  async getComments() {
    return "getComments";
  }

  async deleteComment() {
    return "deleteComment";
  }
}
