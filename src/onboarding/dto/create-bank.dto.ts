import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsMongoId } from "class-validator";

export class CreateBankDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  receiptName: string;

  @ApiProperty({ example: "Bank of America" })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({ example: "123456789" })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: "987654321" })
  @IsNotEmpty()
  @IsString()
  routingNumber: string;

  @ApiProperty({ example: "123 Main St" })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: "Los Angeles" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: "California" })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: "90001" })
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiProperty({ example: "USA" })
  @IsNotEmpty()
  @IsString()
  country: string;
}
