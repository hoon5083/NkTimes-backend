import { Module } from "@nestjs/common";
import { TalkingsService } from "./talkings.service";
import { TalkingsController } from "./talkings.controller";

@Module({
  providers: [TalkingsService],
  controllers: [TalkingsController],
})
export class TalkingsModule {}
