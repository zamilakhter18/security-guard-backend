import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { userTypeEnum } from 'src/helpers/constants';

export class UserTypeDto {
  @ApiProperty({
    example: 'company / individual / client',
  })
  @IsEnum(userTypeEnum, { message: 'Invalid user type' })
  @IsNotEmpty({ message: 'User type is required' })
  userType: userTypeEnum;
}

export class ServicesDto {
}
