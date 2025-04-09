import { Injectable, Logger } from "@nestjs/common";
import mongoose, { Model, ObjectId } from "mongoose";
import { CreateGuardsDto } from "./dto/create-guard.dto";
import { Request, Response } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { COMPANY_GUARD_MODEL, CompanyGuardDocument } from "src/schemas/guard.schema";
import { ResponseHandler } from "src/helpers/response-handler";
import { GuardSignUpDto } from "./dto/guard-sign-up.dto";
import { BranchService } from "src/helpers/branch.service";
import { COMPANY_MODEL, CompanyDocument } from "src/schemas/company.schema";
import { JwtService } from "src/helpers/jwt.service";
import { MailService } from "src/helpers/mail.service";
import { CommonService } from "src/helpers/common.service";
import { messages } from "src/helpers/message";
import { userTypeEnum } from "src/helpers/constants";

@Injectable()
export class CompanyGuardService {
  private readonly logger = new Logger(CompanyGuardService.name);
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(COMPANY_GUARD_MODEL) private readonly companyGuardModel: Model<CompanyGuardDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly branchService: BranchService,
    @InjectModel(COMPANY_MODEL) private readonly companyModel: Model<CompanyDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly commonService: CommonService
  ) {}

  async createOneGuard(companyId: string, res: Response, createGuardsDto: CreateGuardsDto) {
    this.logger.debug("A request to create a guard has been made");
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      let { email, firstName, lastName, dateOfBirth, service } = createGuardsDto;
      const company = await this.companyModel.findById(companyId);
      if (!company.companyMaxSize) {
        return this.responseHandler.errorResponse(res, "First, set the company size");
      }

      service = new mongoose.Types.ObjectId(service);

      const isEmailExists = await this.userModel.findOne({ email }).session(session);
      if (isEmailExists) {
        await session.abortTransaction();
        session.endSession();
        return this.responseHandler.errorResponse(res, messages.EMAIL_ALREADY_EXIST);
      }

      const [createdGuard] = await this.userModel.create(
        [
          {
            email,
            firstName,
            lastName,
            dateOfBirth,
            services: [service],
          },
        ],
        { session }
      );

      if (!createdGuard) {
        await session.abortTransaction();
        session.endSession();
        return this.responseHandler.errorResponse(res, messages.GUARD_CREATION_FAILED);
      }

      // ✅ Create entry in companyGuardModel
      const guard = await this.companyGuardModel.create(
        {
          userId: createdGuard._id,
          companyId,
        },
        { session }
      );

      if (!guard) {
        await session.abortTransaction();
        session.endSession();
        return this.responseHandler.errorResponse(res, messages.GUARD_CREATION_FAILED);
      }

      // ✅ Commit transaction
      await session.commitTransaction();
      session.endSession();

      const refData = {
        _id: createdGuard._id,
        email: createdGuard.email,
        firstName: createdGuard.firstName,
        lastName: createdGuard.lastName,
        dateOfBirth: createdGuard.dateOfBirth,
        services: createdGuard.services[0],
      };

      const step = await this.commonService.checkStep(createdGuard._id.toString());
      this.logger.debug("Guard created successfully");
      return this.responseHandler.successResponseWithData(res, messages.GUARD_CREATION_SUCCESS, refData);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error("Error while creating guard", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async getAllGuardsofACompany(res, userId: string) {
    const guards = await this.userModel.aggregate([
      {
        $lookup: {
          from: "companyguards",
          localField: "companyId",
          foreignField: "companyId",
          as: "guards",
        },
      },
      { $unwind: "$guards" },
      {
        $lookup: {
          from: "users",
          localField: "guards.userId",
          foreignField: "_id",
          as: "guardDetails",
        },
      },
      { $unwind: "$guardDetails" },

      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },

      {
        $addFields: {
          serviceId: {
            $arrayElemAt: ["$guardDetails.services", 0],
          },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          _id: "$guardDetails._id",
          firstName: "$guardDetails.firstName",
          lastName: "$guardDetails.lastName",
          email: "$guardDetails.email",
          serviceId: {
            $arrayElemAt: ["$guardDetails.services", 0],
          },
          dateOfBirth: "$guardDetails.dateOfBirth",
          companyId: "$companyId",
          serviceName: {
            $arrayElemAt: ["$result.name", 0],
          },
        },
      },
    ]);

    return this.responseHandler.successResponseWithData(res, messages.GUARD_FETCHED_SUCCESS, guards);
  }

  async updateOneGuard(res: Response, createGuardsDto: CreateGuardsDto, id: string) {
    this.logger.debug("A request to update a guard has been made");

    try {
      let { email, firstName, lastName, dateOfBirth, service } = createGuardsDto;

      service = new mongoose.Types.ObjectId(service);

      const user = await this.userModel.findById(id);
      if (!user) {
        return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
      }

      const guardExistedEmail = user.email;

      if (email !== guardExistedEmail) {
        const isEmailExists = await this.userModel.findOne({ email });
        if (isEmailExists) {
          return this.responseHandler.errorResponse(res, messages.EMAIL_ALREADY_EXIST);
        }
      }

      const updatedGuard = await this.userModel.findByIdAndUpdate(
        id,
        {
          email,
          firstName,
          lastName,
          dateOfBirth,
          services: [service],
        },
        { new: true }
      );
      if (!updatedGuard) {
        return this.responseHandler.errorResponse(res, messages.GUARD_UPDATION_FAILED);
      }
      const refData = {
        _id: updatedGuard._id,
        email: updatedGuard.email,
        firstName: updatedGuard.firstName,
        lastName: updatedGuard.lastName,
        dateOfBirth: updatedGuard.dateOfBirth,
        services: updatedGuard.services?.[0],
      };

      this.logger.debug("Guard updated successfully");
      return this.responseHandler.successResponseWithData(res, "Guard created successfully", refData);
    } catch (error) {
      this.logger.error("Error while updating guard", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async deleteOneGuard(res: Response, id: string) {
    try {
      const result = await this.userModel.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return this.responseHandler.errorResponse(res, "Guard not found");
      }

      return this.responseHandler.successResponse(res, "Guard deleted successfully");
    } catch (error) {
      this.logger.error("Error while finding a guard", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  // async guardSignUp(req, res: Response, guardSignUpDto: GuardSignUpDto) {
  //   try {
  //   } catch (error) {
  //     this.logger.error("Error while signing up a guard", error);
  //     return this.responseHandler.catchErrorResponse(res);
  //   }
  // }

  // async generateLink(userId: string, res: Response) {
  //   try {
  //     const guards = await this.userModel.aggregate([
  //       {
  //         $lookup: {
  //           from: "companyguards",
  //           localField: "companyId",
  //           foreignField: "companyId",
  //           as: "guards",
  //         },
  //       },
  //       { $unwind: "$guards" },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "guards.userId",
  //           foreignField: "_id",
  //           as: "guardDetails",
  //         },
  //       },
  //       { $unwind: "$guardDetails" },

  //       {
  //         $match: { _id: new mongoose.Types.ObjectId(userId) },
  //       },

  //       {
  //         $addFields: {
  //           serviceId: {
  //             $arrayElemAt: ["$guardDetails.services", 0],
  //           },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "services",
  //           localField: "serviceId",
  //           foreignField: "_id",
  //           as: "result",
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: "$guardDetails._id",
  //           firstName: "$guardDetails.firstName",
  //           lastName: "$guardDetails.lastName",
  //           email: "$guardDetails.email",
  //           userType: "$guardDetails.userType",
  //           // serviceId: {
  //           //   $arrayElemAt: ["$guardDetails.services", 0],
  //           // },
  //           // dateOfBirth: "$guardDetails.dateOfBirth",
  //           companyId: "$companyId",
  //           // serviceName: {
  //           //   $arrayElemAt: ["$result.name", 0],
  //           // },
  //         },
  //       },
  //     ]);

  //     console.log("----guards-----", guards);

  //     // Generate tokens and links in parallel
  //     const promises = guards.map(async (guard) => {
  //       const email = guard?.email;
  //       const tokenData = {
  //         userId: guard?._id,
  //         firstName: guard?.firstName,
  //         lastName: guard?.lastName,
  //         email: guard?.email,
  //         userType: guard?.userType,
  //         companyId: guard?._id,
  //         companyName: guard?.companyName,
  //       };

  //       console.log("----tokenData-----", tokenData);

  //       // const token = await this.jwtService.sign(tokenData);
  //       const link = await this.branchService.generateDeepLink(tokenData);

  //       const subject = "Your Invitation Link";
  //       const html = `<p>Your deep link is: <strong><a href="${link}">${link}</a></strong></p>`;

  //       return this.mailService.sendEmail(email, subject, html);
  //     });

  //     // Wait for all emails to be sent
  //     await Promise.all(promises);

  //     return this.responseHandler.successResponse(res, "Guard details sent successfully");
  //   } catch (error) {
  //     this.logger.error("Error while generating a link", error);
  //     return this.responseHandler.catchErrorResponse(res);
  //   }
  // }
}
