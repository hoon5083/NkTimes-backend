import { Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CommentsService } from "./comments.service";

@Controller("comments")
@UseGuards(GoogleAuthGuard({ strict: true }))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment() {
    return this.commentsService.createComment();
  }

  @Get()
  async getComments() {
    return this.commentsService.getComments();
  }

  @Delete(":id")
  async deleteComment() {
    return this.commentsService.deleteComment();
  }
}
