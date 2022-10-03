import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

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
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: this.configService.get("app.env") !== "production",
      logging: this.configService.get("app.env") !== "production",
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
