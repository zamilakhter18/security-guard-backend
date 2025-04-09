import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";

// @ApiTags at the controller level
export function FileTag() {
  return ApiTags("File");
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

// Swagger decorator for file upload
export function UploadFileSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: ["file"],
        properties: {
          file: {
            type: "string",
            format: "binary", // This tells Swagger that it's a file upload
          },
        },
      },
    }),
    ApiOperation({ summary: "Upload a file" }),
    ApiResponse({
      status: 200,
      description: "File uploaded successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "File uploaded successfully",
          data: "678dyfiudyf78uyfd87505991cf1/profile-1743240381080.jpg",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Invalid file format or missing file",
      schema: {
        example: {
          statusCode: 400,
          message: "Invalid file format or missing file",
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: "Unauthorized: Missing or invalid token",
      schema: {
        example: {
          statusCode: 401,
          message: "Unauthorized: Missing or invalid token",
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}

// Swagger decorator for file delete
export function DeleteFileSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Delete a file" }),
    ApiResponse({
      status: 200,
      description: "File deleted successfully",
      schema: {
        example: { statusCode: 200, message: "File deleted successfully" },
      },
    }),
    ApiBadRequestResponse({
      description: "Path is required",
      schema: {
        example: { statusCode: 400, message: "Path is required" },
      },
    }),
    ApiNotFoundResponse({
      description: "File does not exist in cloud storage",
      schema: {
        example: {
          statusCode: 404,
          message: "File does not exist in cloud storage",
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: "Unauthorized: Missing or invalid token",
      schema: {
        example: {
          statusCode: 401,
          message: "Unauthorized: Missing or invalid token",
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}
