import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDetailDto, UpdateUserDto } from "./dtos/update-user.dto";
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
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("Only admin can access users list");
      }
      const queryBuilder = manager
        .createQueryBuilder(User, "user")
        .limit(userPageQuery.getLimit())
        .offset(userPageQuery.getOffset())
        .orderBy("user.id", "DESC");
      if (valueToBoolean(userPageQuery.isPending)) {
        queryBuilder.where("user.is_approved = false");
      }
      return queryBuilder.getManyAndCount();
    });
  }

  async createUser(currentUser, createUserDto: CreateUserDto) {
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
        throw new BadRequestException("Student Info Needed(grade, class, studentId)");
      }
      if (createUserDto.authority === UserEnum.ADMIN) {
        throw new BadRequestException("Cannot create Admin");
      }
      const nicknameDuplication = Boolean(
        await manager.findOne(User, { where: { nickname: createUserDto.nickname } })
      );
      const phoneDuplication = Boolean(
        await manager.findOne(User, { where: { phone: createUserDto.phone } })
      );
      if (nicknameDuplication) {
        throw new BadRequestException("nickname duplicated");
      }
      if (phoneDuplication) {
        throw new BadRequestException("phone duplicated");
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
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      return user;
    });
  }

  async updateMe(currentUser, updateUserDto: UpdateUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const nicknameDuplication = Boolean(
        await manager.findOne(User, { where: { nickname: updateUserDto.nickname } })
      );
      const phoneDuplication = Boolean(
        await manager.findOne(User, { where: { phone: updateUserDto.phone } })
      );
      if (nicknameDuplication) {
        throw new BadRequestException("nickname duplicated");
      }
      if (phoneDuplication) {
        throw new BadRequestException("phone duplicated");
      }
      await manager.update(User, user.id, updateUserDto);
      return Object.assign(user, updateUserDto);
    });
  }

  async deleteMe(currentUser) {
    return await this.dataSource.transaction(async (manager) => {
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
      return Boolean((await manager.delete(User, user.id)).affected);
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
      return Boolean((await manager.delete(User, id)).affected);
    });
  }

  async updateUser(id: number, currentUser, updateUserDetailDto: UpdateUserDetailDto) {
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
      const nicknameDuplication = Boolean(
        await manager.findOne(User, { where: { nickname: updateUserDetailDto.nickname } })
      );
      const phoneDuplication = Boolean(
        await manager.findOne(User, { where: { phone: updateUserDetailDto.phone } })
      );
      if (nicknameDuplication) {
        throw new BadRequestException("nickname duplicated");
      }
      if (phoneDuplication) {
        throw new BadRequestException("phone duplicated");
      }
      await manager.update(User, id, updateUserDetailDto);
      return Object.assign(user, updateUserDetailDto);
    });
  }
}
