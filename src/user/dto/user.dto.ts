import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { userTypeEnum } from 'src/helpers/constants';

export class UserTypeDto {
  @ApiProperty({
    example: userTypeEnum.COMPANY,
    enum: userTypeEnum,
    description: 'User type: company, individual, or client',
  })
  @IsEnum(userTypeEnum, { message: 'Invalid user type' })
  @IsNotEmpty({ message: 'User type is required' })
  userType: userTypeEnum;
}
