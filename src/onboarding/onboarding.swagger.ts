import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanySizeDto } from "./dto/company-size.dto";
import { CompanyLogoDto } from "./dto/company-logo.dto";
import { DocumentDto } from "./dto/document.dto";
import { SetDateOfBirthDto } from "./dto/set-date-of-birth.dto";

// @ApiTags at the controller level
export function OnboardingTag() {
  return applyDecorators(ApiTags("Onboarding"));
}

// Reusable Swagger response for 500 errors
export function InternalServerErrorSwagger() {
  return ApiResponse({
    status: 500,
    description: "Something Went Wrong",
    schema: {
      example: { statusCode: 500, error: "Something Went Wrong" },
    },
  });
}

// Swagger decorator for CreateCompanySwagger()
export function CreateCompanySwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Create company information" }),
    ApiResponse({
      status: 200,
      description: "Company created successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Company created successfully",
          data: {
            email: "contact@techcorp.com",
            firstName: "John",
            lastName: "Doe",
            userType: "company",
            services: [],
            step: 4,
            isProfileSetup: true,
            isVerified: true,
            companyId: "64f8d2c6e1c2f5b3c7b5a7a9",
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            UserAlreadyHasCompany: {
              value: { statusCode: 400, message: "User already has a company" },
            },
            CompanyEmailExists: {
              value: {
                statusCode: 400,
                message: "Company already exists with this email",
              },
            },
            CompanyPhoneExists: {
              value: {
                statusCode: 400,
                message: "Company already exists with this phone number",
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function SendPhoneOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Send Otp to phone number" }),
    ApiResponse({
      status: 200,
      description: "Otp sent successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Otp sent successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            PhoneAlreadyExists: {
              value: {
                statusCode: 400,
                message: "Phone number already exists in a company",
              },
            },
            InvalidPhoneNumber: {
              value: {
                statusCode: 400,
                message: "Phone number must be a valid",
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}
export function ResendPhoneOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Resend Otp to phone number" }),
    ApiResponse({
      status: 200,
      description: "Otp sent successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Otp sent successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            PhoneAlreadyExists: {
              value: {
                statusCode: 400,
                message: "Phone number already exists in a company",
              },
            },
            InvalidPhoneNumber: {
              value: {
                statusCode: 400,
                message: "Phone number must be a valid",
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function VerifyPhoneOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Verify Otp for user phone" }),
    ApiResponse({
      status: 200,
      description: "Otp verified successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Otp verified successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            UserNotFound: {
              value: { statusCode: 400, message: "User not found" },
            },
            IncorrectOtp: {
              value: { statusCode: 400, message: "Incorrect Otp" },
            },
            OtpExpired: {
              value: { statusCode: 400, message: "Otp expired" },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function CompanySizeSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Update company size",
      description: "Allows a company to update its minimum and maximum size.",
    }),
    ApiBody({ type: CompanySizeDto }),
    ApiResponse({
      status: 200,
      description: "Company size updated successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Company size updated successfully",
          data: {
            companyId: "64f8d2c6e1c2f5b3c7b5a7a9",
            companyMinSize: "10",
            companyMaxSize: "15",
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            CompanyNotFound: {
              value: { statusCode: 400, message: "Company not found" },
            },
            InvalidCompanySize: {
              value: { statusCode: 400, message: "Invalid company size" },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function CompanyLogoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Upload company logo",
      description: "Allows a company to upload or update its logo.",
    }),
    ApiBody({ type: CompanyLogoDto }),
    ApiResponse({
      status: 200,
      description: "Logo set successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Logo set successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            InvalidLogo: {
              value: { statusCode: 400, message: "Invalid logo format" },
            },
            CompanyNotFound: {
              value: { statusCode: 400, message: "Company not found" },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function DocumentSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Upload user documents",
      description: "Allows a user to upload AWS S3 URLs for W-Form, licence, and insurance documents.",
    }),
    ApiBody({ type: DocumentDto }),
    ApiResponse({
      status: 200,
      description: "Document uploaded successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Document uploaded successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            MissingFields: {
              value: {
                statusCode: 400,
                message: "Missing required document fields",
              },
            },
            InvalidURL: {
              value: {
                statusCode: 400,
                message: "Invalid URL format for document",
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}

export function DateOfBirthSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Update date of birth",
      description: "Allows users to set their date of birth.",
    }),
    ApiBody({ type: SetDateOfBirthDto }),
    ApiResponse({
      status: 200,
      description: "Date of birth updated successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Date of birth updated",
          data: {
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            userType: "individual",
            step: 5,
            isProfileSetup: true,
            isVerified: true,
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            UserNotFound: {
              value: { statusCode: 400, message: "User not found" },
            },
            InvalidUserType: {
              value: { statusCode: 400, message: "Invalid user type" },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: { statusCode: 500, error: "Something Went Wrong" },
      },
    })
  );
}
export function createBankSwagger() {
  return applyDecorators(ApiBearerAuth());
}
