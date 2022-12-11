import { AuthorDto } from "src/common/dtos/author.dto";
import { Article } from "src/common/entities/article.entity";

export class ArticleBriefDto {
  constructor(article: Article) {
    this.id = article.id;
    this.title = article.title;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.author = new AuthorDto(article.author);
    this.board = { id: article.board.id, title: article.board.title };
    this.likeCount = article.likeCount;
  }

  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorDto;
  board: { id: number; title: string };
  likeCount: number;
}

export class ArticleDetailDto extends ArticleBriefDto {
  constructor(article: Article) {
    super(article);
    this.content = article.content;
    this.fileKeys = article.files ? article.files.map((file) => file.key) : [];
    this.isLiked = Boolean(article.userLikeCount);
  }
  isLiked: boolean;
  content: string;
  fileKeys: string[];
}
