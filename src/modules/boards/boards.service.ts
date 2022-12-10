import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Board } from "src/common/entities/board.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { BoardPageQuery } from "./dtos/board-page-query.dto";
import { CreateBoardDto } from "./dtos/create-board.dto";
import { UpdateBoardDto } from "./dtos/update-board.dto";

function valueToBoolean(value: any) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (["true", "on", "yes", "1"].includes(value.toLowerCase())) {
    return true;
  }
  if (["false", "off", "no", "0"].includes(value.toLowerCase())) {
    return false;
  }
  return value;
}
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

  async getBoards(currentUser, getBoardsQuery: BoardPageQuery) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (
        (valueToBoolean(getBoardsQuery.viewAll) || valueToBoolean(getBoardsQuery.isPending)) ===
          true &&
        user.authority !== UserEnum.ADMIN
      ) {
        throw new ForbiddenException("Only admin can get not approved boards");
      }
      const queryBuilder = manager
        .createQueryBuilder(Board, "board")
        .leftJoinAndSelect("board.applicant", "applicant")
        .limit(getBoardsQuery.getLimit())
        .offset(getBoardsQuery.getOffset());
      if (valueToBoolean(getBoardsQuery.isPending)) {
        queryBuilder.where("board.is_approved = false");
      } else if (!valueToBoolean(getBoardsQuery.viewAll)) {
        queryBuilder.where("board.is_approved = true");
      }

      return await queryBuilder.getManyAndCount();
    });
  }

  async getBoard(currentUser, id) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      } else if (user.authority === UserEnum.PENDING) {
        throw new ForbiddenException();
      }
      const board = await manager.findOne(Board, { where: { id: id } });
      if (!board) {
        throw new NotFoundException();
      } else if (!board.isApproved) {
        throw new BadRequestException();
      }
      return board;
    });
  }

  async updateBoard(currentUser, id, updateBoardDto: UpdateBoardDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      }
      const board = await manager.findOne(Board, {
        where: { id: id },
        relations: { applicant: true },
      });
      if (updateBoardDto.isApproved !== undefined && user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException();
      } else if (board.applicant.id !== user.id) {
        throw new ForbiddenException();
      }
      await manager.update(Board, id, updateBoardDto);
      return Object.assign(board, updateBoardDto);
    });
  }

  async deleteBoard(currentUser, id) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      } else if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException();
      }
      await manager.delete(Board, id);
    });
  }
}
