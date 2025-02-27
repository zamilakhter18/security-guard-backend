import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe implementation
  app.useGlobalPipes(new ValidationPipe());

  //Swagger implementation
  const config = new DocumentBuilder()
    .setTitle('Security Guard App API Documentation')
    .setDescription('This API provides endpoints for managing guards')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, documentFactory, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // Get port from .env and listen
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
