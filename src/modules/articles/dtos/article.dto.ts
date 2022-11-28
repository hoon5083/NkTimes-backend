import { Article } from "src/common/entities/article.entity";
import { UserDto } from "src/modules/users/dtos/user.dto";

export class ArticleBriefDto {
  constructor(article: Article) {
    this.id = article.id;
    this.title = article.title;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.author = new UserDto(article.author);
    this.boardId = article.board.id;
    this.likeCount = article.likeCount;
  }

  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  author: UserDto;
  boardId: number;
  likeCount: number;
}

export class ArticleDetailDto extends ArticleBriefDto {
  constructor(article: Article) {
    super(article);
    this.content = article.content;
    this.fileKeys = article.files?.map((file) => file.key);
  }

  content: string;
  fileKeys: string[];
}
