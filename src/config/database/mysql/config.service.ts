import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class MysqlConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.configService.get("database.host"),
      port: this.configService.get<number>("database.port"),
      username: this.configService.get("database.username"),
      password: this.configService.get("database.password"),
      database: this.configService.get("database.name"),
      autoLoadEntities: this.configService.get("app.env") === "development",
      synchronize: this.configService.get("app.env") === "development",
      logging: true,
    };
  }
}
