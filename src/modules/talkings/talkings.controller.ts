import { Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { TalkingsService } from "./talkings.service";

@Controller("talkings")
//@UseGuards(GoogleAuthGuard({ strict: true }))
export class TalkingsController {
  constructor(private readonly talkingsService: TalkingsService) {}

  @Post()
  async createTalkings() {
    return this.talkingsService.createTalkings();
  }

  @Get()
  async getTalkings() {
    return this.talkingsService.getTalkings();
  }

  @Patch()
  async updateTalking() {
    return this.talkingsService.updateTalking();
  }

  @Delete()
  async deleteTalking() {
    return this.talkingsService.deleteTalking();
  }
}
