import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./board.entity";
import { Comment } from "./comment.entity";
import { File } from "./file.entity";
import { Like } from "./like.entity";
import { User } from "./user.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 15000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  @JoinColumn()
  author: User;

  @ManyToOne(() => Board, (board) => board.articles, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn()
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.article)
  likes: Like[];

  @OneToMany(() => File, (file) => file.article)
  files: File[];

  likeCount: number;
  userLikeCount: number;
}
