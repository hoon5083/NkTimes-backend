import { AuthorDto } from "src/common/dtos/author.dto";
import { Talking } from "src/common/entities/talking.entity";

export class TalkingDto {
  constructor(talking: Talking) {
    this.id = talking.id;
    this.content = talking.content;
    this.createdAt = talking.createdAt;
    this.updatedAt = talking.updatedAt;
    this.author = new AuthorDto(talking.author);
  }
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorDto;
}
