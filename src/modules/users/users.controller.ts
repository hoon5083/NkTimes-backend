import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(GoogleAuthGuard({ strict: false })) // true
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@CurrentUser() currentUser) {
    return await this.usersService.getUsers(currentUser);
  }

  @Post()
  async createUser(@CurrentUser() currentUser) {
    return await this.usersService.createUser(currentUser);
  }

  @Get("me")
  async getMe(@CurrentUser() currentUser) {
    return await this.usersService.getMe(currentUser);
  }

  @Patch("me")
  async updateMe(@CurrentUser() currentUser) {
    return await this.usersService.updateMe(currentUser);
  }

  @Delete("me")
  async deleteMe(currentUser) {
    return await this.usersService.deleteMe(currentUser);
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() currentUser) {
    return await this.usersService.deleteUser(id, currentUser);
  }

  @Patch(":id")
  async updateUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() currentUser) {
    return await this.usersService.updateUser(id, currentUser);
  }
}
