import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { userTypeEnum } from "src/helpers/constants";

export class UserTypeDto {
  @ApiProperty({
    example: "company",
  })
  @IsEnum([userTypeEnum.CLIENT, userTypeEnum.COMPANY], {
    message: "Invalid user type",
  })
  @IsNotEmpty({ message: "User type is required" })
  userType: userTypeEnum;
}

export class ServiceDto {
  @ApiProperty({
    example: ["65df1b2c3f8a4e001c5a7d5e", "65df1b2c3f8a4e001c5a7d5f"],
    type: [String],
  })
  @IsArray()
  @IsMongoId({
    each: true,
    message: "Each service ID must be a valid MongoDB ObjectId",
  })
  service: string[];
}
