import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/app/config.module";

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
