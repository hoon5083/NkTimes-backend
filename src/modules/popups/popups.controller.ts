import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CreatePopupDto } from "./dtos/create-popup.dto";
import { PopupsService } from "./popups.service";

@Controller("popups")
export class PopupsController {
  constructor(private readonly popupsService: PopupsService) {}

  @Post()
  @UseGuards(GoogleAuthGuard({ strict: true }))
  async createPopup(@CurrentUser() currentUser, @Body() createPopupDto: CreatePopupDto) {
    return this.popupsService.createPopup(currentUser, createPopupDto);
  }

  @Get()
  async getPopup() {
    return this.popupsService.getPopup();
  }
}
