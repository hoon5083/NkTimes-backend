import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Controller("comments")
@UseGuards(GoogleAuthGuard({ strict: true }))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @CurrentUser() currentUser,
    @Query("articleId") articleId: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentsService.createComment(currentUser, articleId, createCommentDto);
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
