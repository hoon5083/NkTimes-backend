import { BadRequestException, Injectable } from "@nestjs/common";
import { FileClientService } from "../client.service";
import * as fs from "fs";
import * as path from "path";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalFileClientService implements FileClientService {
  private readonly publicPath: string;

  constructor(private readonly configService: ConfigService) {
    this.publicPath = path.join(this.configService.get("app.root"), "public");
  }

  async uploadFile(
    key: string,
    file: Buffer,
    size: number,
    uploadTime: Date,
    originalName: string,
    mimeType: string
  ) {
    try {
      fs.mkdirSync(this.publicPath);
    } catch (error) {}

    const filePath = path.join(this.publicPath, key);
    fs.writeFileSync(filePath, file);
  }

  async getFile(key: string) {
    const filePath = path.join(this.publicPath, key);

    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath);
    } else {
      throw new BadRequestException("File Not Found");
    }
  }

  async removeFile(key: string) {
    const filePath = path.join(this.publicPath, key);

    if (fs.existsSync(filePath)) {
      return fs.unlinkSync(filePath);
    } else {
      throw new BadRequestException("File Not Found");
    }
  }
}
