import { DynamicModule, Module } from "@nestjs/common";
import { LocalFileClientService } from "./local/client.service";
import { MinioModule } from "nestjs-minio-client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioClientService } from "./minio/client.service";
import { FileClientType } from "./enums/file-client-type.enum";
import { FILE_CLIENT_SERVICE } from "src/common/constants";
import { S3ClientService } from "./s3/client.service";
import { MulterModule } from "@nestjs/platform-express";

@Module({})
export class FileConfigModule {
  static register(type: FileClientType): DynamicModule {
    switch (type) {
      case FileClientType.LOCAL:
        return {
          module: FileConfigModule,
          providers: [
            {
              provide: FILE_CLIENT_SERVICE,
              useClass: LocalFileClientService,
            },
          ],
          exports: [FILE_CLIENT_SERVICE],
        };
      case FileClientType.MINIO:
        return {
          module: FileConfigModule,
          imports: [
            MinioModule.registerAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: async (config: ConfigService) => {
                return {
                  endPoint: config.get("MINIO_END_POINT"),
                  port: parseInt(config.get("MINIO_PORT")),
                  useSSL: false,
                  accessKey: config.get("MINIO_ACCESS_KEY"),
                  secretKey: config.get("MINIO_SECRET_KEY"),
                };
              },
            }),
          ],
          providers: [
            {
              provide: FILE_CLIENT_SERVICE,
              useClass: MinioClientService,
            },
          ],
          exports: [FILE_CLIENT_SERVICE],
        };
      case FileClientType.S3:
        return {
          module: FileConfigModule,
          providers: [
            {
              provide: FILE_CLIENT_SERVICE,
              useClass: S3ClientService,
            },
          ],
          exports: [FILE_CLIENT_SERVICE],
        };
    }
  }
}
