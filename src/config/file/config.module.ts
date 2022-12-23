import { DynamicModule, Module } from "@nestjs/common";
import { LocalFileClientService } from "./local/client.service";
import { FileClientType } from "./enums/file-client-type.enum";
import { FILE_CLIENT_SERVICE } from "src/common/constants";
import { S3ClientService } from "./s3/client.service";

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
