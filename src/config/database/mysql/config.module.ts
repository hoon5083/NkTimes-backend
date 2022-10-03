import { Module } from "@nestjs/common";
import { MysqlConfigService } from "./config.service";

@Module({
  providers: [MysqlConfigService],
})
export class MysqlConfigModule {}
