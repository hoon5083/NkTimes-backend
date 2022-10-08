import { Injectable } from "@nestjs/common";
import { Talking } from "src/common/entities/talking.entity";
import { User } from "src/common/entities/user.entity";
import { DataSource } from "typeorm";
import { CreateTalkingDto } from "./dtos/create-talkings.dto";

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

  async getTalkings() {
    return "getTalkings";
  }

  async updateTalking() {
    return "updateTalking";
  }

  async deleteTalking() {
    return "deleteTalking";
  }
}
