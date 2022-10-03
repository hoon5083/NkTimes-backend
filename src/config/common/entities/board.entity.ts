import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne, JoinColumn } from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  introduction: string;

  @ManyToOne(() => User, (user) => user.boards, { nullable: false })
  @JoinColumn()
  applicant: User;

  @OneToMany(() => Article, (article) => article.board)
  articles: Article[];
}