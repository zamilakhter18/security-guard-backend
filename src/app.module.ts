import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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

        const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=DevSecuritGuard`;
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [],
})
export class AppModule {}
