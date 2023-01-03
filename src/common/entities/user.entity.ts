import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { UserEnum } from "../enums/user.enum";
import { Article } from "./article.entity";
import { Board } from "./board.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Talking } from "./talking.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 15 })
  nickname: string;

  @Column()
  authority: UserEnum;

  @Column()
  email: string;

  @Column({ nullable: true })
  grade: number;

  @Column({ nullable: true })
  class: number;

  @Column({ nullable: true })
  studentId: number;

  @Column({ unique: true })
  phone: string;

  @Column({ length: 50 })
  name: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  graduateYear: number;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Board, (board) => board.applicant)
  boards: Board[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Talking, (talking) => talking.author)
  talkings: Talking[];
}
