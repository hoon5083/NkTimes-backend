import { ForbiddenException, Injectable } from "@nestjs/common";
import { Board } from "src/common/entities/board.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";

@Injectable()
export class BoardsService {
  constructor(private readonly dataSource: DataSource) {}

  async createBoard(currentUser, createBoardDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException("Pending User");
      }
      createBoardDto.applicant = user;
      const board = await manager.create(Board, createBoardDto);
      await manager.save(board);
      return board;
    });
  }

  async getBoards(currentUser, getBoardsQuery) {
    return "getBoards";
  }

  async getBoard(currentUser, id) {
    return "getBoard";
  }

  async updateBoard(currentUser, id, updateBoardDto) {
    return "updateBoard";
  }

  async deleteBoard(currentUser, id) {
    return "deleteUser";
  }
}
