import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";

export class UserDto {
  constructor(user: User) {
    this.nickname = user.nickname;
    this.authority = user.authority;
    this.email = user.email;
    this.grade = user.grade;
    this.class = user.class;
    this.studentId = user.studentId;
  }

  nickname: string;
  authority: UserEnum;
  email: string;
  grade?: number;
  class?: number;
  studentId?: number;
}
