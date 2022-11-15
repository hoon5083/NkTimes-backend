import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { File } from "../../common/entities/file.entity";
import { FileClientService } from "src/config/file/client.service";
import { FILE_CLIENT_SERVICE } from "src/common/constants";

@Injectable()
export class FilesService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(FILE_CLIENT_SERVICE) private readonly fileClientService: FileClientService
  ) {}

  async uploadFile(uploadedFile: Express.Multer.File) {
    return "uploadFile";
  }

  async getFile(key: string) {
    return "getFile";
  }

  async deleteFile(key: string) {
    return "deleteFile";
  }
}
