import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}
  async getUsers(currentUser) {
    return { currentUser, api: "getusers" };
  }

  async createUser(currentUser, createUserDto: CreateUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      if (existingUser) {
        throw new BadRequestException("Already registered user");
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
    return { currentUser, api: "getme" };
  }

  async updateMe(currentUser) {
    return { currentUser, api: "updateme" };
  }

  async deleteMe(currentUser) {
    return { currentUser, api: "deleteme" };
  }

  async deleteUser(id: number, currentUser) {
    return { currentUser, id, api: "deleteUser" };
  }

  async updateUser(id: number, currentUser) {
    return { currentUser, id, api: "updateUser" };
  }
}
