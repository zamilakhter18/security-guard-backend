import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CompanySizeDto {
  @ApiProperty({
    example: "15",
    description: "Maximum number of employees in the company",
  })
  @ApiProperty({ example: "15" })
  @IsNotEmpty()
  @IsString()
  companyMaxSize: string;
}
