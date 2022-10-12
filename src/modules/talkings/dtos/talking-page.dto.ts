import { PageDto } from "src/common/dtos/pagination/page.dto";
import { Talking } from "src/common/entities/talking.entity";
import { TalkingDto } from "./talking.dto";

export class TalkingPageDto extends PageDto<TalkingDto> {
  constructor(totalCount: number, pageSize: number, pageNumber: number, talkings: Talking[]) {
    super(
      totalCount,
      pageSize,
      pageNumber,
      talkings.map((talking) => {
        return new TalkingDto(talking);
      })
    );
  }
}
