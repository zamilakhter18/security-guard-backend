import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestException, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { ExecutionTimeInterceptor } from "./interceptors/execution-time.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ExecutionTimeInterceptor());

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

        exceptionFactory: (errors) => {
          // console.error("errors", errors);
          const extractConstraints = (error) => {
            if (error.constraints) {
              return Object.values(error.constraints)[0];
            }
            if (error.children && error.children.length > 0) {
              return extractConstraints(error.children[0]);
            }
            return "Validation error";
          };

          const firstError = extractConstraints(errors[0]);

          return new BadRequestException(firstError);
        },
      })
    );

    // Get ConfigService
    const configService = app.get(ConfigService);

    // checking swagger enable
    const swaggerEnabled = configService.get<string>("SWAGGER_ENABLE") === "true";
    if (swaggerEnabled) {
      // Swagger setup
      const config = new DocumentBuilder().setTitle("Smart Select App API Documentation").setDescription("Smart Select App API Description").setVersion("1.0").addBearerAuth().build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("apis", app, document, {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
        jsonDocumentUrl: "apis/json",
      });
    } else {
      this.logger.log("Swagger documentation is disabled");
    }

    // listening on port
    const port = configService.get<number>("PORT") || 3000;
    await app.listen(port);
    logger.debug(`Server is running on port ${port}`);
  } catch (error) {
    logger.error("Error starting application", error.stack);
  }
}
bootstrap();
