import { IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class SetDateOfBirthDto {
  @ApiProperty({ example: '1990-01-01' })
  @IsISO8601({ strict: true }) // Ensures it accepts YYYY-MM-DD format
  dateOfBirth: string;
}

// export class SetDateOfBirthDto {
//   @ApiProperty({ example: '1990-01-01' })
//   @IsNotEmpty()
//   @IsDateString()
//   dateOfBirth: Date;
// }
