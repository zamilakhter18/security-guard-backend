import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CompanyLogoDto {
  @ApiProperty({
    example: "https://s3.amazonaws.com/bucket-name/uploads/logo.png",
    description: "URL of the company logo",
  })
  @IsNotEmpty()
  @IsString()
  logo: string;
}
