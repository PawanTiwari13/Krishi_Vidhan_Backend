import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 8080);
  const frontendUrl = configService.get<string>(
    'cors.frontendUrl',
    'http://localhost:3000',
  );

  // Global REST API prefix
  app.setGlobalPrefix('api/v1');

  // Strict CORS origin allowlist (Fixes SEC-14)
  app.enableCors({
    origin: [frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Strict Global DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Krishi Vidhan Enterprise API')
    .setDescription(
      'Modular Monolith REST API for Krishi Vidhan Agricultural Marketplace',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`Krishi Vidhan API running on http://localhost:${port}/api/v1`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();

