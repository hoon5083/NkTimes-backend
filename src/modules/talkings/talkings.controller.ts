import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserPageQuery } from "../users/dtos/user-page-query.dto";
import { CreateTalkingDto } from "./dtos/create-talkings.dto";
import { TalkingPageQuery } from "./dtos/talking-page-query.dto";
import { TalkingPageDto } from "./dtos/talking-page.dto";
import { UpdateTalkingDto } from "./dtos/update-talking.dto";
import { TalkingsService } from "./talkings.service";

@Controller("talkings")
@UseGuards(GoogleAuthGuard({ strict: true }))
export class TalkingsController {
  constructor(private readonly talkingsService: TalkingsService) {}

  @Post()
  async createTalking(@CurrentUser() currentUser, @Body() createTalkingDto: CreateTalkingDto) {
    return this.talkingsService.createTalking(currentUser, createTalkingDto);
  }

  @Get()
  async getTalkings(@Query() talkingPageQuery: TalkingPageQuery) {
    const [talkings, count] = await this.talkingsService.getTalkings(talkingPageQuery);
    return new TalkingPageDto(
      count,
      talkingPageQuery.getLimit(),
      talkingPageQuery.pageNumber,
      talkings
    );
  }

  @Patch(":id")
  async updateTalking(
    @CurrentUser() currentUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTalkingDto: UpdateTalkingDto
  ) {
    return this.talkingsService.updateTalking(currentUser, id, updateTalkingDto);
  }

  @Delete(":id")
  async deleteTalking(@Param("id", ParseIntPipe) id: number) {
    return this.talkingsService.deleteTalking(id);
  }
}
