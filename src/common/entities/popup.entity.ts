import { Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { File } from "./file.entity";

@Entity()
export class Popup {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => File, (file) => file.popup)
  file: File;
}
