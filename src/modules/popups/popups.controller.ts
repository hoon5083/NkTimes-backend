import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { PopupsService } from "./popups.service";

@Controller("popups")
export class PopupsController {
  constructor(private readonly popupsService: PopupsService) {}

  @Post()
  async createPopup(@CurrentUser() currentUser) {
    return this.popupsService.createPopup(currentUser);
  }

  @Get()
  async getPopup(@CurrentUser() currentUser) {
    return this.popupsService.getPopup(currentUser);
  }
}
