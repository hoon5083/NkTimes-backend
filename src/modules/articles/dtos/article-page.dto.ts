import { PageDto } from "src/common/dtos/pagination/page.dto";
import { Article } from "src/common/entities/article.entity";
import { ArticleBriefDto } from "./article.dto";

export class ArticlePageDto extends PageDto<ArticleBriefDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, articles: Article[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      articles.map((article) => {
        return new ArticleBriefDto(article);
      })
    );
  }
}
