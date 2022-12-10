import { PageDto } from "src/common/dtos/pagination/page.dto";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { UserDto } from "./user.dto";

export class UserPageDto extends PageDto<UserDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, users: User[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      users.map((user) => {
        return new UserDto(user);
      })
    );
    this.metadata = new MetaData();
  }

  metadata: MetaData;
}

export class MetaData {
  authorities: string[];

  constructor() {
    this.authorities = Object.values(UserEnum);
  }
}
