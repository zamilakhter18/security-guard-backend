import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// @ApiTags at the controller level
export function AuthTag() {
  return ApiTags("Auth");
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

// Swagger decorator for sendOtp()
export function SendOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Send Otp to user email" }),
    ApiResponse({
      status: 200,
      description: "Otp sent successfully",
      schema: {
        example: { statusCode: 200, message: "Otp sent successfully" },
      },
    }),
    ApiResponse({
      status: 400,
      description: "User already exists",
      schema: { example: { statusCode: 400, message: "User already exists" } },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for resendOtp()
export function ResendOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Resend Otp to user email" }),
    ApiResponse({
      status: 200,
      description: "Otp resent successfully",
      schema: {
        example: { statusCode: 200, message: "Otp resent successfully" },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            UserAlreadyExists: {
              value: { statusCode: 400, message: "User already exists" },
            },
            FailedToSendOtp: {
              value: { statusCode: 400, message: "Failed to send Otp" },
            },
          },
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for verifyOtp()
export function VerifyOtpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Verify Otp for user email" }),
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
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for signUp()
export function SignUpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Sign up a new user" }),
    ApiResponse({
      status: 200,
      description: "User created successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "User created successfully",
          data: {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            step: 1,
            isProfileSetup: false,
          },
          token: "your_jwt_token",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            EmailExists: {
              value: { statusCode: 400, message: "Email already exists" },
            },
            UserCreationFailed: {
              value: { statusCode: 400, message: "User creation failed" },
            },
          },
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for signIn()
export function SignInSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Sign in user" }),
    ApiResponse({
      status: 200,
      description: "User signed in successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Login successful",
          data: {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            isVerified: true,
            step: 1,
            isProfileSetup: false,
          },
          token: "your_jwt_token",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            EmailNotFound: {
              value: { statusCode: 400, message: "Email not found" },
            },
            IncorrectPassword: {
              value: { statusCode: 400, message: "Incorrect password" },
            },
          },
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for social authentication()
export function socialAuthSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Sign up or Sign in with Google/Facebook/Apple" }),
    ApiResponse({
      status: 200,
      description: "User authenticated successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "User authenticated",
          data: { token: "jwt_token_here" },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Invalid token or type",
      schema: {
        example: { statusCode: 400, message: "Invalid token or type" },
      },
    }),
    InternalServerErrorSwagger()
  );
}
