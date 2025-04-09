import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BranchService {
  private readonly branchKey: string;
  private readonly branchSecret: string;
  private readonly branchAppId: string;

  constructor(private readonly configService: ConfigService) {
    this.branchKey = this.configService.get<string>("KEY");
    this.branchSecret = this.configService.get<string>("SECRET");
    this.branchAppId = this.configService.get<string>("APP_ID");

    if (!this.branchKey || !this.branchSecret || !this.branchAppId) {
      throw new InternalServerErrorException("Branch.io credentials are missing in environment variables");
    }
  }

  async generateDeepLink(
    tokenData: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: string;
      companyId: string;
      companyName: string;
    },
    feature: string = "sharing"
  ): Promise<string> {
    try {
      console.log("------------token data in service-------", tokenData);
      const response = await axios.post("https://api2.branch.io/v1/url", {
        branch_key: this.branchKey,
        campaign: "user_invite",
        feature: "invite",
        channel: "email",
        data: {
          email: tokenData.email,
          userId: tokenData.userId,
          userType: tokenData.userType,
          firstName: tokenData.firstName,
          lastName: tokenData.lastName,
          companyId: tokenData.userId,
          companyName: tokenData.companyName,
        },
      });

      console.log("-----response.data.------", response.data);
      if (!response.data?.url) {
        throw new Error("Invalid response from Branch.io");
      }

      console.log("Deep link generated:", response.data.url);
      return response.data.url;
    } catch (error) {
      console.error("Failed to generate deep link:", error.response?.data || error.message || error);
      throw new InternalServerErrorException("Failed to generate deep link");
    }
  }
}
