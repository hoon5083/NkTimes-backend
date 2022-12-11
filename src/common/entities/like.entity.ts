import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { nullable: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Article, (article) => article.likes, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn()
  article: Article;
}
