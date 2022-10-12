import { PageDto } from "src/common/dtos/pagination/page.dto";
import { Board } from "src/common/entities/board.entity";
import { BoardDetailDto, BoardDto } from "./board.dto";

export class BoardPageDto extends PageDto<BoardDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, boards: Board[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      boards.map((board) => {
        return new BoardDto(board);
      })
    );
  }
}

export class BoardDetailPageDto extends PageDto<BoardDetailDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, boards: Board[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      boards.map((board) => {
        return new BoardDetailDto(board);
      })
    );
  }
}
