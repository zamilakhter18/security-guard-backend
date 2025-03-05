import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activating Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables transformation for DTOs
      whitelist: true, // Strips out extra fields
      forbidNonWhitelisted: true, // Blocks extra fields instead of ignoring
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Get ConfigService
  const configService = app.get(ConfigService);

  // checking swagger enable
  const swaggerEnabled = configService.get<string>('SWAGGER_ENABLE') === 'true';
  if (swaggerEnabled) {
    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('Security Guard App API Documentation')
      .setDescription(
        'The Security Guard App API provides a robust backend for managing security personnel, clients, and companies. It includes features such as user authentication, service management, real-time communication, and security operations tracking. This API is built using NestJS and MongoDB, ensuring scalability and efficiency for security service providers.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('apis', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
      jsonDocumentUrl: 'apis/json',
    });
  } else {
    console.log('Swagger documentation is disabled.');
  }

  // listening on port
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
