import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class SetProfilePhoto {
  @ApiProperty({
    example: "https://s3.amazonaws.com/bucket-name/profile-photo.img",
  })
  @IsString()
  @IsNotEmpty()
  profilePhoto: string;
}
