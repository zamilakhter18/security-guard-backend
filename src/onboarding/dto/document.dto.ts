import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class Document {
  @ApiProperty({ example: "https://s3.amazonaws.com/bucket-name/wForm.pdf" })
  @IsOptional()
  @IsString()
  idCardFront: string;

  @ApiProperty({ example: "https://s3.amazonaws.com/bucket-name/wForm.pdf" })
  @IsOptional()
  @IsString()
  idCardBack: string;

  @ApiProperty({ example: "https://s3.amazonaws.com/bucket-name/wForm.pdf" })
  @IsOptional()
  @IsString()
  wForm: string;

  @ApiProperty({ example: "https://s3.amazonaws.com/bucket-name/licence.pdf" })
  @IsOptional()
  @IsString()
  licence: string;

  @ApiProperty({
    example: "https://s3.amazonaws.com/bucket-name/insurance.pdf",
  })
  @IsOptional()
  @IsString()
  insurance: string;
}

export class DocumentDto {
  @ApiProperty({
    description: "Object containing AWS S3 file URLs for documents",
    example: {
      idCardFront: "https://s3.amazonaws.com/bucket-name/idCardFront.pdf",
      idCardBack: "https://s3.amazonaws.com/bucket-name/idCardBack.pdf",
      wForm: "https://s3.amazonaws.com/bucket-name/wForm.pdf",
      licence: "https://s3.amazonaws.com/bucket-name/licence.pdf",
      insurance: "https://s3.amazonaws.com/bucket-name/insurance.pdf",
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Document)
  @IsNotEmpty()
  document: Document;
}
