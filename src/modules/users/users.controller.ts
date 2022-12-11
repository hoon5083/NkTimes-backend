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
import { SuccessDto } from "src/common/dtos/success.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDetailDto, UpdateUserDto } from "./dtos/update-user.dto";
import { UserPageQuery } from "./dtos/user-page-query.dto";
import { UserPageDto } from "./dtos/user-page.dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(GoogleAuthGuard({ strict: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@CurrentUser() currentUser, @Query() userPageQuery: UserPageQuery) {
    const [users, count] = await this.usersService.getUsers(currentUser, userPageQuery);
    return new UserPageDto(count, userPageQuery.getLimit(), userPageQuery.pageNumber, users);
  }

  @Post()
  async createUser(@CurrentUser() currentUser, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(currentUser, createUserDto);
  }

  @Get("me")
  async getMe(@CurrentUser() currentUser) {
    const user = await this.usersService.getMe(currentUser);
    return new UserDto(user);
  }

  @Patch("me")
  async updateMe(@CurrentUser() currentUser, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateMe(currentUser, updateUserDto);
    return new UserDto(user);
  }

  @Delete("me")
  async deleteMe(@CurrentUser() currentUser) {
    return new SuccessDto(await this.usersService.deleteMe(currentUser));
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() currentUser) {
    return new SuccessDto(await this.usersService.deleteUser(id, currentUser));
  }

  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser,
    @Body() updateUserDetailDto: UpdateUserDetailDto
  ) {
    const user = await this.usersService.updateUser(id, currentUser, updateUserDetailDto);
    return new UserDto(user);
  }
}
