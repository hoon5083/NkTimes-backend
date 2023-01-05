import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: ["https://nktone.com", "https://www.nktone.com"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  await app.listen(appConfig.get("app.port"));
}
bootstrap();
