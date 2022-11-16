import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { File } from "src/common/entities/file.entity";
import { Popup } from "src/common/entities/popup.entity";
import { User } from "src/common/entities/user.entity";
import { UserEnum } from "src/common/enums/user.enum";
import { DataSource } from "typeorm";
import { CreatePopupDto } from "./dtos/create-popup.dto";

@Injectable()
export class PopupsService {
  constructor(private readonly dataSource: DataSource) {}

  async createPopup(currentUser, createPopupDto: CreatePopupDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { email: currentUser.email } });
      if (!user) {
        throw new UnauthorizedException();
      } else if (user.authority !== UserEnum.ADMIN) {
        throw new ForbiddenException();
      }
      const photo = await manager.findOne(File, { where: { key: createPopupDto.key } });
      if (!photo) {
        throw new NotFoundException();
      }
      const partialPopup = { file: null };
      partialPopup.file = photo;
      const popup = await manager.create(Popup, partialPopup);
      await manager.save(popup);
      return popup;
    });
  }

  async getPopup() {
    return "getPopup";
  }
}
