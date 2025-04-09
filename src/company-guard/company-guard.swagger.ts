import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateGuardsDto } from "./dto/create-guard.dto";

// @ApiTags at the controller level
export function CompanyGuardTag() {
  return applyDecorators(ApiTags("CompanyGuard"));
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

export function CreateAGuardSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Create a single guard",
    }),
    ApiBody({ type: CreateGuardsDto }),
    ApiResponse({
      status: 201,
      description: "Guards created successfully",
      schema: {
        example: {
          statusCode: 201,
          message: "Guards created successfully",
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Bad Request",
      content: {
        "application/json": {
          examples: {
            DuplicateEmails: {
              value: {
                statusCode: 400,
                message: "Duplicate emails in request",
              },
            },
            DuplicatePhones: {
              value: {
                statusCode: 400,
                message: "Duplicate phone numbers in request",
              },
            },
            ExistingEmailOrPhone: {
              value: {
                statusCode: 400,
                message: "Email or phone number already exists.",
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

export function GetAllGuardsofACompanySwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function UpdateOneGuardSwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function DeleteOneGuardSwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function SignUpGuardSwagger() {
  return applyDecorators(ApiBearerAuth());
}

export function GenerateLinkSwagger() {
  return applyDecorators(ApiBearerAuth());
}
