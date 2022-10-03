import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/app/config.module";
import { UsersModule } from "./modules/users/users.module";
import { ArticlesModule } from "./modules/articles/articles.module";
import { BoardsModule } from "./modules/boards/boards.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { TalkingsModule } from "./modules/talkings/talkings.module";
import { FilesModule } from "./modules/files/files.module";
import { PopupsModule } from "./modules/popups/popups.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    ArticlesModule,
    BoardsModule,
    CommentsModule,
    TalkingsModule,
    FilesModule,
    PopupsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
