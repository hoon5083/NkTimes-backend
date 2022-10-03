import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  author: User;

  @ManyToOne(() => Article, (article) => article.comments, { nullable: false })
  article: Article;
}
