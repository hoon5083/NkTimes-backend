import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class BoardsService {
  constructor(private readonly dataSource: DataSource) {}

  async createBoard(currentUser, createBoardDto) {
    return "createBoard";
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
