import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);

  console.log(`🚀 API rodando em http://localhost:${PORT}`);
}

bootstrap();
