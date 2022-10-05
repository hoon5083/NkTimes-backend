import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserPageQuery } from "./dtos/user-page-query.dto";

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
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async getUsers(currentUser, userPageQuery: UserPageQuery) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("Only admin can access users list");
      }
      const queryBuilder = manager.createQueryBuilder(User, "user"); //order by 추가 필요, 동시에 엔티티 수정 필요
      if (valueToBoolean(userPageQuery.isPending)) {
        queryBuilder.where("user.is_approved = false");
      }
      return queryBuilder.getManyAndCount();
    });
  }

  async createUser(currentUser, createUserDto: CreateUserDto) {
    //닉네임 중복 체크
    //번호 중복 체크, 전화번호 중복 체크
    return await this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (existingUser) {
        if (!existingUser.isApproved) {
          throw new BadRequestException("Register is pending");
        } else {
          throw new BadRequestException("Already registered user");
        }
      }
      if (
        createUserDto.authority !== UserEnum.GRADUATE &&
        createUserDto.authority !== UserEnum.TEACHER &&
        (!createUserDto.class || !createUserDto.grade || !createUserDto.studentId)
      ) {
        throw new BadRequestException("Student Info Needed");
      }
      if (createUserDto.authority === UserEnum.ADMIN) {
        throw new BadRequestException("Cannot create Admin");
      }
      createUserDto.email = currentUser.email;
      const user = await manager.create(User, createUserDto);
      await manager.save(user);
      return user;
    });
  }

  async getMe(currentUser) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (!user) {
        throw new NotFoundException("There is no user with that email");
      }
      if (!user.isApproved) {
        throw new BadRequestException("Register Pending");
      }
      return user;
    });
  }

  async updateMe(currentUser) {
    return { currentUser, api: "updateme" };
  }

  async deleteMe(currentUser) {
    return await this.dataSource.transaction(async (manager) => {
      console.log(currentUser);
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      if (user.authority === UserEnum.ADMIN) {
        throw new BadRequestException("Cannot delete admin yourself");
      }
      return await manager.delete(User, user.id);
    });
  }

  async deleteUser(id: number, currentUser) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("Only Admin users can delete users");
      }
      if (user.id === id) {
        throw new BadRequestException("Cannot delete admin yourself");
      }
      return await manager.delete(User, id);
    });
  }

  async updateUser(id: number, currentUser, updateUserDetailDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("Only Admin users can update users");
      }
      return await manager.update(User, id, updateUserDetailDto);
    });
  }
}
