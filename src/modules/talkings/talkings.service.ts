import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Talking } from "src/common/entities/talking.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreateTalkingDto } from "./dtos/create-talkings.dto";
import { TalkingPageQuery } from "./dtos/talking-page-query.dto";
import { UpdateTalkingDto } from "./dtos/update-talking.dto";

@Injectable()
export class TalkingsService {
  constructor(private readonly dataSource: DataSource) {}

  async createTalking(currentUser, createTalkingDto: CreateTalkingDto) {
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
      createTalkingDto.author = user;
      const talking = await manager.create<Talking>(Talking, createTalkingDto);
      await manager.save(talking);
      return talking;
    });
  }

  async getTalkings(currentUser, talkingPageQuery: TalkingPageQuery) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      return await manager.findAndCount(Talking, {
        order: { createdAt: "DESC" },
        relations: { author: true },
        take: talkingPageQuery.getLimit(),
        skip: talkingPageQuery.getOffset(),
      });
    });
  }

  async updateTalking(currentUser, id: number, updateTalkingDto: UpdateTalkingDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const talking = await manager.findOne(Talking, {
        where: { id },
        relations: { author: true },
      });
      if (talking.author.id !== user.id) {
        throw new ForbiddenException("You are not an author");
      }
      await manager.update(Talking, id, updateTalkingDto);
      return Object.assign(talking, updateTalkingDto);
    });
  }

  async deleteTalking(currentUser, id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException("Not Registered");
      }
      if (!user.isApproved) {
        throw new ForbiddenException("Register is pending");
      }
      const talking = await manager.findOne(Talking, {
        where: { id: id },
        relations: { author: true },
      });
      if (talking.author.id !== user.id && talking.author.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException("You are not an author or admin");
      }
      return Boolean((await manager.delete(Talking, id)).affected);
    });
  }
}
