import { IsEnum, IsNotEmpty } from 'class-validator';
import { userTypeEnum } from 'src/helpers/constants';

export class UserTypeDto {
  @IsEnum(userTypeEnum, { message: 'Invalid user type' })
  @IsNotEmpty({ message: 'User type is required' })
  userType: userTypeEnum;
}
