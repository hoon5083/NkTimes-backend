import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://nktimes.nktone.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const appConfig = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  await app.listen(appConfig.get("app.port"));
}
bootstrap();
