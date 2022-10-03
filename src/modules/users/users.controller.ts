import {
  Body,
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
import { CreateUserDto } from "./dtos/create-user.dto";
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
  async createUser(@CurrentUser() currentUser, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(currentUser, createUserDto);
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
