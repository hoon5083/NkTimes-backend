import { User } from "../entities/user.entity";
import { UserEnum } from "../enums/user.enum";

export class AuthorDto {
  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.authority = user.authority;
    this.grade = user.grade;
    this.class = user.class;
  }

  id: number;
  nickname: string;
  authority: UserEnum;
  grade: number;
  class: number;
}
