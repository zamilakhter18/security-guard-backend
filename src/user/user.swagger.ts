import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

// @ApiTags and @ApiBearerAuth at the controller level
export function UserTag() {
  return applyDecorators(ApiTags("User"));
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

// Swagger decorator for setUserType()
export function SetUserTypeSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Set user type for an authenticated user" }),
    ApiResponse({
      status: 200,
      description: "UserType set successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "UserType set successfully",
          data: {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            userType: "company / client",
            step: 1,
            isProfileSetup: false,
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad request (validation or other errors)",
      content: {
        "application/json": {
          examples: {
            UserUpdateFailed: {
              value: { statusCode: 400, message: "User update failed" },
            },
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
      status: 401,
      description: "Unauthorized",
      schema: { example: { statusCode: 401, message: "Unauthorized user" } },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for setServices()
export function SetServicesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Set services for an authenticated user" }),
    ApiResponse({
      status: 200,
      description: "User service has been set successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "User service has been set successfully",
          data: {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            userType: "company / client",
            step: 3,
            isProfileSetup: false,
            services: ["65df1b2c3f8a4e001c5a7d5e", "65df1b2c3f8a4e001c5a7d5f"],
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad request (validation or other errors)",
      content: {
        "application/json": {
          examples: {
            InvalidServiceArray: {
              value: {
                statusCode: 400,
                message: "Service array is required and should not be empty",
              },
            },
            InvalidServiceId: {
              value: {
                statusCode: 400,
                message: "One or more service IDs are invalid",
              },
            },
            ServiceNotFound: {
              value: {
                statusCode: 400,
                message: "One or more service IDs do not exist in the database",
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: "Unauthorized",
      schema: { example: { statusCode: 401, message: "Unauthorized user" } },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for getServices()
export function GetServicesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Get services of an authenticated user" }),
    ApiResponse({
      status: 200,
      description: "Services retrieved successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "User services retrieved successfully",
          data: [
            { _id: "65df1b2c3f8a4e001c5a7d5e", name: "Security Consulting" },
            { _id: "65df1b2c3f8a4e001c5a7d5f", name: "Cybersecurity" },
          ],
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: "User not found or other bad request errors",
      schema: { example: { statusCode: 400, message: "User not found" } },
    }),
    ApiResponse({
      status: 401,
      description: "Unauthorized",
      schema: { example: { statusCode: 401, message: "Unauthorized user" } },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for forgetPassword()
export function forgetPasswordSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Forgot Password - Send OTP" }),
    ApiResponse({
      status: 200,
      description: "OTP sent successfully",
      schema: {
        example: { statusCode: 200, message: "OTP sent successfully" },
      },
    }),
    ApiBadRequestResponse({
      description: "Invalid email format",
      schema: {
        example: { statusCode: 400, message: "Invalid email format" },
      },
    }),
    ApiNotFoundResponse({
      description: "User not found",
      schema: {
        example: { statusCode: 404, message: "User not found" },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for resetPassword()
export function ResetPasswordSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Reset Password" }),
    ApiResponse({
      status: 200,
      description: "Password reset successfully",
      schema: {
        example: { statusCode: 200, message: "Password reset successfully" },
      },
    }),
    ApiBadRequestResponse({
      description: "Password cannot be the same as the previous one",
      schema: {
        example: {
          statusCode: 400,
          message: "Password cannot be the same as the previous one",
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: "Unauthorized - Invalid or missing token",
      schema: {
        example: { statusCode: 401, message: "Unauthorized" },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for getUser()
export function getUserSwagger() {
  return applyDecorators(ApiBearerAuth());
}

// Swagger decorator for updateUser()
export function updateUserSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Update user profile" }),
    ApiResponse({
      status: 200,
      description: "User updated successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "User updated successfully",
          data: {
            userId: "6612a15df9e5f53b58f6f123",
            email: "jane.doe@example.com",
            phone: "+11234567890",
            countryCode: "+1",
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
            profilePhoto: "profile_photo_url_or_id",
            gender: "female"
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
            EmailAlreadyExists: {
              value: {
                statusCode: 400,
                message: "Email already exists",
              },
            },
            PhoneAlreadyExists: {
              value: {
                statusCode: 400,
                message: "Phone number already exists",
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
        example: {
          statusCode: 500,
          error: "Something Went Wrong",
        },
      },
    })
  );
}


export function DeleteUserSwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function GetBankAccountSwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function UpdateBankAccountSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Update bank account information" }),
    ApiResponse({
      status: 200,
      description: "Bank account updated successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Bank account updated successfully",
          data: {
            _id: "6612fabc1234567890abcdef",
            userId: "6612fabc1234567890abcdee",
            accountNumber: "123456789",
            receiptName: "John Doe",
            bankName: "Bank of America",
            routingNumber: "110000000",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipcode: "10001",
            country: "USA",
            createdAt: "2024-04-01T10:00:00.000Z",
            updatedAt: "2025-04-07T08:30:00.000Z",
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad request (validation or other errors)",
      content: {
        "application/json": {
          examples: {
            NoBankAccountFound: {
              value: { statusCode: 400, message: "No bank account found" },
            },
            BankAccountUpdateFailed: {
              value: { statusCode: 400, message: "Bank account update failed" },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: "Unauthorized",
      schema: { example: { statusCode: 401, message: "Unauthorized user" } },
    }),
    ApiResponse({
      status: 500,
      description: "Something Went Wrong",
      schema: {
        example: {
          statusCode: 500,
          error: "Something Went Wrong",
        },
      },
    })
  );
}


