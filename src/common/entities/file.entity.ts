import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { Popup } from "./popup.entity";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Popup, (popup) => popup.file, { onDelete: "CASCADE" })
  popup: Popup;

  @ManyToOne(() => Article, (article) => article.files, { onDelete: "CASCADE" })
  @JoinColumn()
  article: Article;
}
