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
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dtos/create-board.dto";
import { UpdateBoardDto } from "./dtos/update-board.dto";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createBoard(@CurrentUser() currentUser, @Body() createBoardDto: CreateBoardDto) {
    return await this.boardsService.createBoard(currentUser, createBoardDto);
  }

  @Get()
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getBoards(@CurrentUser() currentUser, @Query() boardPageQuery) {
    return await this.boardsService.getBoards(currentUser, boardPageQuery);
  }

  @Get(":id")
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getBoard(@CurrentUser() currentUser, @Param("id", ParseIntPipe) id: number) {
    return await this.boardsService.getBoard(currentUser, id);
  }

  @Patch(":id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async updateBoard(
    @CurrentUser() currentUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBoardDto: UpdateBoardDto
  ) {
    return await this.boardsService.updateBoard(currentUser, id, updateBoardDto);
  }

  @Delete(":id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteBoard(@CurrentUser() currentUser, @Param("id", ParseIntPipe) id: number) {
    return await this.boardsService.deleteBoard(currentUser, id);
  }
}
