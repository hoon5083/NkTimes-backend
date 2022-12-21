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
import { DataSource, Not } from "typeorm";
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

  async createBoard(currentUser, createBoardDto: CreateBoardDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const titleDuplication = Boolean(
        await manager.count(Board, { where: { title: createBoardDto.title } })
      );
      if (titleDuplication) {
        throw new BadRequestException("title duplicated");
      }
      const board = await manager.create<Board>(Board, {
        title: createBoardDto.title,
        introduction: createBoardDto.introduction,
        applicant: user,
        whitelist: createBoardDto.whitelist?.join(" "),
      });
      await manager.save(board);
      return board;
    });
  }

  async getBoards(currentUser, getBoardsQuery: BoardPageQuery) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
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

  async getBoard(currentUser, id: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
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

  async updateBoard(currentUser, id: number, updateBoardDto: UpdateBoardDto) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      }
      const board = await manager.findOne(Board, {
        where: { id: id },
        relations: { applicant: true },
      });
      const titleDuplication = Boolean(
        await manager.count(Board, { where: { title: updateBoardDto.title, id: Not(id) } })
      );
      if (titleDuplication) {
        throw new BadRequestException("title duplicated");
      }
      if (updateBoardDto.isApproved !== undefined && user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException();
      } else if (board.applicant.id !== user.id) {
        throw new ForbiddenException();
      }
      await manager.update(Board, id, {
        isApproved: updateBoardDto.isApproved,
        whitelist: updateBoardDto.whitelist?.join(" "),
      });
      return Object.assign(board, updateBoardDto);
    });
  }

  async deleteBoard(currentUser, id: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      } else if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException();
      }
      if (Boolean((await manager.delete(Board, id)).affected)) {
        return true;
      } else {
        throw new BadRequestException();
      }
    });
  }
}
