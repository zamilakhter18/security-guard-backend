import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { userTypeEnum } from 'src/helpers/constants';

export class UserTypeDto {
  @ApiProperty({
    example: 'company / individual / client',
  })
  @IsEnum(userTypeEnum, { message: 'Invalid user type' })
  @IsNotEmpty({ message: 'User type is required' })
  userType: userTypeEnum;
}

export class ServiceDto {
  @ApiProperty({ example: ['65df1b2c3f8a4e001c5a7d5e', '65df1b2c3f8a4e001c5a7d5f'] })
  @IsArray()
  // @IsMongoId({ each: true })
  service: string[];
}
