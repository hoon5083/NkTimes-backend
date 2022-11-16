import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { extname } from "path";

const MAXSIZE = 1e7;
const FILE_EXISTENSION = /jpg|jpeg|png|svg|webp|pdf|doc|docx/;

@Injectable()
export class ParseFilePipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
    if (file === undefined || file === null) {
      throw new BadRequestException("No file uploaded");
    }

    if (file["size"] > MAXSIZE) {
      throw new BadRequestException("Over maximum file size");
    }

    if (!FILE_EXISTENSION.test(extname(file["originalname"]).toLocaleLowerCase())) {
      throw new BadRequestException("Invalid file type");
    }

    return file;
  }
}
