import { PageDto } from "src/common/dtos/pagination/page.dto";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { UserDetailDto } from "./user.dto";

export class UserPageDto extends PageDto<UserDetailDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, users: User[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      users.map((recruitment) => {
        return new UserDetailDto(recruitment);
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
