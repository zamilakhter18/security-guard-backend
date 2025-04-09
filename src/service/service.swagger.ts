import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// @ApiTags at the controller level
export function ServiceTag() {
  return applyDecorators(ApiTags("Service"), ApiBearerAuth());
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

// Swagger decorator for listAllServices()
export function ListAllServicesSwagger() {
  return applyDecorators(
    ApiOperation({ summary: "Listing all the services" }),
    ApiResponse({
      status: 200,
      description: "Services retrieved successfully",
      schema: {
        example: {
          statusCode: 200,
          message: "Services retrieved successfully",
          data: [
            {
              _id: "60b8d295f1d2c1234a56789a",
              name: "Security Patrol",
            },
            {
              _id: "60b8d295f1d2c1234a56789b",
              name: "Surveillance Monitoring",
            },
            {
              _id: "60b8d295f1d2c1234a56789c",
              name: "Emergency Response",
            },
          ],
        },
      },
    }),
    InternalServerErrorSwagger()
  );
}
