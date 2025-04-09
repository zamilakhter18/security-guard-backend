import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class TwilioService {
  private readonly twilioAccountSid: string;
  private readonly twilioAuthToken: string;
  private readonly twilioBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.twilioAccountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    this.twilioAuthToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
    this.twilioBaseUrl = "https://lookups.twilio.com/v1/PhoneNumbers/";
  }

  async verifyPhoneNumber(countryCode: string, phoneNumber: string): Promise<any> {
    try {
      const url = `${this.twilioBaseUrl}${countryCode}${phoneNumber}?Type=carrier`;

      console.log("------url-----", url);

      const auth = Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString("base64");
      console.log("------auth-----", auth);
      const response = await axios.get(url, {
        auth: {
          username: this.twilioAccountSid,
          password: this.twilioAuthToken,
        },
      });
      console.log("------response-----", response.data);
      return response.data;
    } catch (error) {
      return error.response?.data || { error: "Verification failed" };
    }
  }

  // Send OTP
  async sendOtpForPhoneNumber(url: string, urlencoded: Record<string, any>): Promise<any> {
    try {
      const response = await axios.post(url, urlencoded, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        auth: {
          username: this.twilioAccountSid,
          password: this.twilioAuthToken,
        },
      });

      console.log("-----response----", response.data);

      return {
        status: 200,
        response: response.data,
      };
    } catch (error) {
      return {
        status: 400,
        error: error.response?.data || { error: "OTP sending failed" },
      };
    }
  }

  // otp verify
  async otpVerify(accountSid: string, authToken: string, url: string, urlencoded: URLSearchParams) {
    let returnObj: any = {};
    try {
      const response = await axios.post(url, urlencoded, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        auth: {
          username: accountSid,
          password: authToken,
        },
      });

      returnObj.status = 200;
      returnObj.response = response.data;
      return returnObj;
    } catch (error) {
      returnObj.status = 400;
      returnObj.error = error.response?.data || {
        message: "Unknown Twilio Error",
      };
      return returnObj;
    }
  }
}
