import { Injectable } from "@nestjs/common";
import { Talking } from "src/common/entities/talking.entity";
import { User } from "src/common/entities/user.entity";
import { DataSource } from "typeorm";
import { CreateTalkingDto } from "./dtos/create-talkings.dto";
import { TalkingPageQuery } from "./dtos/talking-page-query.dto";
import { UpdateTalkingDto } from "./dtos/update-talking.dto";

@Injectable()
export class TalkingsService {
  constructor(private readonly dataSource: DataSource) {}

  async createTalking(currentUser, createTalkingDto: CreateTalkingDto) {
    return await this.dataSource.transaction(async (manager) => {
      createTalkingDto.author = await manager.findOne(User, {
        where: { email: currentUser.email },
      });
      const talking = await manager.create(Talking, createTalkingDto);
      await manager.save(talking);
      return talking;
    });
  }

  async getTalkings(talkingPageQuery: TalkingPageQuery) {
    return await this.dataSource.transaction(async (manager) => {
      return await manager.findAndCount(Talking, {
        order: { createdAt: "DESC" },
        relations: { author: true },
        take: talkingPageQuery.getLimit(),
        skip: talkingPageQuery.getOffset(),
      });
    });
  }

  async updateTalking(currentuser, id: number, updateTalkingDto: UpdateTalkingDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await manager.update(Talking, id, updateTalkingDto);
    });
  }

  async deleteTalking(id: number) {
    return "deleteTalking";
  }
}
