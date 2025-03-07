import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServiceModule } from './service/service.module';
import { OnboardingModule } from './onboarding/onboarding.module';

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
        const dbUserName = configService.get('DATABASE_USERNAME');
        const dbPassword = configService.get('DATABASE_PASSWORD');
        const dbHost = configService.get('DATABASE_HOST');
        const dbName = configService.get('DATABASE_NAME');

        // console.log('-------------db name       ------>>>', dbUserName);
        // console.log('-------------db dbPassword ------>>>', dbPassword);
        // console.log('-------------dbHost        ------>>>', dbHost);
        // console.log('-------------db dbName     ------>>>', dbName);

        const uri = configService.get('DATABASE_URI');
        // const uri = configService.get('DB_ZAMIL');

        // console.log('-------------db uri        ------>>>', uri);

        return { uri };
      },
      inject: [ConfigService],
    }),

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
