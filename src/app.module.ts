import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ServiceModule } from "./service/service.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { UploadService } from "./helpers/aws.service";
import { ResponseHandler } from "./helpers/response-handler";
import { AuthGuard } from "./guard/auth.guard";
import { JwtService } from "./helpers/jwt.service";
import { USER_MODEL, UserSchema } from "./schemas/user.schema";
import { CompanyGuardModule } from "./company-guard/company-guard.module";

@Module({
  imports: [
    // Env configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get("DATABASE_URI");
        // const uri = configService.get("DB_ZAMIL");

        return { uri };
      },
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    AuthModule,
    UserModule,
    ServiceModule,
    OnboardingModule,
    CompanyGuardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    UploadService,
    ResponseHandler,
    AuthGuard,
    JwtService,
  ],
  exports: [],
})
export class AppModule {}
