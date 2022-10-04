import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";
export class PageQuery {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageNumber: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize: number;

  getOffset(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
  getLimit(): number {
    return this.pageSize;
  }
}
