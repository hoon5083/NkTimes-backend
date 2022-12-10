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
import { BoardPageQuery } from "./dtos/board-page-query.dto";
import { BoardDetailPageDto, BoardPageDto } from "./dtos/board-page.dto";
import { BoardDetailDto, BoardDto } from "./dtos/board.dto";
import { CreateBoardDto } from "./dtos/create-board.dto";
import { UpdateBoardDto } from "./dtos/update-board.dto";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createBoard(@CurrentUser() currentUser, @Body() createBoardDto: CreateBoardDto) {
    return new BoardDetailDto(await this.boardsService.createBoard(currentUser, createBoardDto));
  }

  @Get()
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getBoards(@CurrentUser() currentUser, @Query() boardPageQuery: BoardPageQuery) {
    const [boards, count] = await this.boardsService.getBoards(currentUser, boardPageQuery);
    if (boardPageQuery.viewAll || boardPageQuery.isPending) {
      return new BoardDetailPageDto(
        count,
        boardPageQuery.getLimit(),
        boardPageQuery.pageNumber,
        boards
      );
    } else {
      return new BoardPageDto(count, boardPageQuery.getLimit(), boardPageQuery.pageNumber, boards);
    }
  }

  @Get(":id")
  @UseGuards(GoogleAuthGuard({ strict: false }))
  async getBoard(@CurrentUser() currentUser, @Param("id", ParseIntPipe) id: number) {
    const board = await this.boardsService.getBoard(currentUser, id);
    return new BoardDto(board);
  }

  @Patch(":id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async updateBoard(
    @CurrentUser() currentUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBoardDto: UpdateBoardDto
  ) {
    return new BoardDetailDto(
      await this.boardsService.updateBoard(currentUser, id, updateBoardDto)
    );
  }

  @Delete(":id")
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async deleteBoard(@CurrentUser() currentUser, @Param("id", ParseIntPipe) id: number) {
    return await this.boardsService.deleteBoard(currentUser, id);
  }
}
