import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class SetGuardAndSecuritySizeDto {
  @ApiProperty({ example: "10" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: "Please add atleast one guard",
  })
  totalGuard: string;

  @ApiProperty({ example: "15" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: "Please add atleast one security guard",
  })
  totalSecurity: string;
}
