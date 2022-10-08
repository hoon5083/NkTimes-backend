import { Injectable } from "@nestjs/common";

@Injectable()
export class TalkingsService {
  //constructor() {}

  async createTalkings() {
    return "createTalkings";
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
