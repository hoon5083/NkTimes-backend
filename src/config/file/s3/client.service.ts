import { BadRequestException, Injectable } from "@nestjs/common";
import { FileClientService } from "../client.service";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

@Injectable()
export class S3ClientService implements FileClientService {
  private readonly S3: AWS.S3;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      credentials: {
        accessKeyId: configService.get("S3_ACCESS_KEY"),
        secretAccessKey: configService.get("S3_SECRET_KEY"),
      },
      region: configService.get("S3_BUCKET_REGION"),
    });
    this.S3 = new AWS.S3();
    this.bucket = this.configService.get("S3_BUCKET_NAME");
  }

  async uploadFile(
    key: string,
    file: Buffer,
    size: number,
    createdAt: Date,
    originalName: string,
    mimeType: string
  ) {
    const metaData = {
      "Content-Type": mimeType,
      createdAt: createdAt.toUTCString(),
      originalName: encodeURI(originalName),
    };

    try {
      await this.S3.putObject({
        Bucket: `${this.bucket}/files`,
        Key: key,
        Body: file,
        ContentType: mimeType,
        Metadata: metaData,
      }).promise();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getFile(key: string) {
    try {
      return await this.S3.getObject({
        Bucket: `${this.bucket}/files`,
        Key: key,
      }).createReadStream();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async removeFile(key: string) {
    try {
      return await this.S3.deleteObject({
        Bucket: `${this.bucket}/files`,
        Key: key,
      }).createReadStream();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
