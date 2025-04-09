import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsISO8601, Validate } from "class-validator";
import { registerDecorator, ValidationOptions } from "class-validator";

// Custom validator to ensure the user is at least 18 years old
// Custom validator to ensure the user is at least 18 years old
export function IsAdult(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsAdult",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const birthDate = new Date(value);
          const today = new Date();

          // Get year, month, and date only (ignore time)
          const birthYear = birthDate.getFullYear();
          const birthMonth = birthDate.getMonth();
          const birthDay = birthDate.getDate();

          const minYear = today.getFullYear() - 18;
          const minMonth = today.getMonth();
          const minDay = today.getDate();

          // Ensure user is at least 18 years old
          if (birthYear > minYear) return false; // Born after cutoff year
          if (birthYear === minYear && birthMonth > minMonth) return false; // Born after cutoff month
          if (birthYear === minYear && birthMonth === minMonth && birthDay > minDay) return false; // Born after cutoff day

          return true;
        },
        defaultMessage() {
          return "You must be at least 18 years old.";
        },
      },
    });
  };
}


export class SetDateOfBirthDto {
  @ApiProperty({
    example: "1990-01-01",
    description: "Date of birth in YYYY-MM-DD format. Must be 18+ years old.",
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true }) // Ensures YYYY-MM-DD format
  @IsAdult({ message: "You must be at least 18 years old." }) // Custom validator
  dateOfBirth: string;
}
