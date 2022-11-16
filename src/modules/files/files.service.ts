import { DataSource } from "typeorm";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { File } from "../../common/entities/file.entity";
import { FileClientService } from "src/config/file/client.service";
import { FILE_CLIENT_SERVICE } from "src/common/constants";
import { v1 } from "uuid";

@Injectable()
export class FilesService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(FILE_CLIENT_SERVICE) private readonly fileClientService: FileClientService
  ) {}

  async uploadFile(uploadedFile: Express.Multer.File) {
    return await this.dataSource.transaction(async (manager) => {
      const { originalname, buffer, size, mimetype } = uploadedFile;
      const createdAt = new Date();
      const key = v1();

      const file = await manager.create(File, {
        key,
        type: mimetype,
        name: originalname,
        createdAt,
      });

      await manager.save(file);
      await this.fileClientService.uploadFile(key, buffer, size, createdAt, originalname, mimetype);

      return file;
    });
  }

  async getFile(key: string) {
    const file = await this.dataSource.manager.findOne(File, {
      where: { key: key },
    });
    if (!file) {
      throw new NotFoundException();
    }
    const stream = await this.fileClientService.getFile(key);

    return { file, stream };
  }
}
