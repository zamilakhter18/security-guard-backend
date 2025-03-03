import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { IndividualModule } from './individual/individual.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:(configService : ConfigService) =>{
        const dbUserName = configService.get('DATABASE_USERNAME');
        const dbPassword = configService.get('DATABASE_PASSWORD');
        const dbHost = configService.get('DATABASE_HOST');
        const dbName = configService.get('DATABASE_NAME');
        const uri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
        return { uri }
      },
      inject : [ConfigService]

    }),
    ClientModule,
    IndividualModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports : []
})
export class AppModule {}
