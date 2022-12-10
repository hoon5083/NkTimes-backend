import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CommentsService } from "./comments.service";
import { CommentPageQuery } from "./dtos/comment-page-query.dto";
import { CommentPageDto } from "./dtos/comment-page.dto";
import { CommentDto } from "./dtos/comment.dto";
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
    return new CommentDto(
      await this.commentsService.createComment(currentUser, articleId, createCommentDto)
    );
  }

  @Get()
  async getComments(@CurrentUser() currentUser, @Query() commentPageQuery: CommentPageQuery) {
    const [comments, count] = await this.commentsService.getComments(currentUser, commentPageQuery);
    return new CommentPageDto(
      count,
      commentPageQuery.getLimit(),
      commentPageQuery.pageNumber,
      comments
    );
  }

  @Delete(":id")
  async deleteComment(@CurrentUser() currentUser, @Param("id") id: number) {
    return await this.commentsService.deleteComment(currentUser, id);
  }
}
