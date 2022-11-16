import { IsNotEmpty, IsString } from "class-validator";

export class CreatePopupDto {
  @IsNotEmpty()
  @IsString()
  key: string;
}
