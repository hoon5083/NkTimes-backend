export class PageDto<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  content: T[];

  constructor(totalCount: number, pageSize: number, pageNumber: number, content: T[]) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.content = content;
  }
}
