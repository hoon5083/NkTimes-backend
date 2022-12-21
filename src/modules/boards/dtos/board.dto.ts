import { AuthorDto } from "src/common/dtos/author.dto";
import { Board } from "src/common/entities/board.entity";

export class BoardDto {
  constructor(board: Board) {
    this.id = board.id;
    this.title = board.title;
    this.isApproved = board.isApproved;
    this.introduction = board.introduction;
    this.whitelist = board.whitelist ? board.whitelist.split(" ") : [];
  }
  id: number;
  title: string;
  isApproved: boolean;
  introduction: string;
  whitelist: string[];
}

export class BoardDetailDto extends BoardDto {
  constructor(board: Board) {
    super(board);
    this.applicant = new AuthorDto(board.applicant);
  }

  applicant: AuthorDto;
}
