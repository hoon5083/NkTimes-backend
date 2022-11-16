import { GoogleAuthGuard } from "src/auth/google/google-auth.guard";
import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  StreamableFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { ParseFilePipe } from "./pipes/parse-file.pipe";

@Controller("files")
@UseGuards(GoogleAuthGuard({ strict: true }))
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile(ParseFilePipe) uploadedFile: Express.Multer.File) {
    return this.filesService.uploadFile(uploadedFile);
  }

  @Get(":key")
  async getFile(@Param("key") key: string) {
    const { file, stream } = await this.filesService.getFile(key);
    return new StreamableFile(stream, { type: file.type });
  }
}
