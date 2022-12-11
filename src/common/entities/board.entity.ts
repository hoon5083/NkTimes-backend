import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEnum } from "../enums/user.enum";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  introduction: string;

  @Column({ default: "관리자 교사 졸업생 재학생 학생회 방송반 신문반" })
  whitelist: string;

  @ManyToOne(() => User, (user) => user.boards, { nullable: false })
  @JoinColumn()
  applicant: User;

  @OneToMany(() => Article, (article) => article.board)
  articles: Article[];
}
