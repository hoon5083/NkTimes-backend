import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";

export class UserDto {
  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.authority = user.authority;
    this.email = user.email;
    this.grade = user.grade;
    this.class = user.class;
    this.studentId = user.studentId;
  }
  id: number;
  nickname: string;
  authority: UserEnum;
  email: string;
  grade?: number;
  class?: number;
  studentId?: number;
}

export class UserDetailDto extends UserDto {
  constructor(user: User) {
    super(user);
    this.phone = user.phone;
    this.name = user.name;
    this.isApproved = user.isApproved;
  }
  phone: string;
  name: string;
  isApproved: boolean;
}
