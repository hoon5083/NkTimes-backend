import { Module } from "@nestjs/common";
import { FileConfigModule } from "src/config/file/config.module";
import { FileClientType } from "src/config/file/enums/file-client-type.enum";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [FileConfigModule.register(FileClientType.S3)],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
