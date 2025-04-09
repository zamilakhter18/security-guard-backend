import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import sgMail from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly senderEmail: string;
  private readonly companyName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("SENDGRID_API_KEY");
    if (!apiKey) {
      throw new InternalServerErrorException("SENDGRID_API_KEY is missing in environment variables");
    }

    sgMail.setApiKey(apiKey);

    this.senderEmail = this.configService.get<string>("SENDGRID_FROM_EMAIL");
    // this.companyName = this.configService.get<string>("COMPANY_NAME");

    if (!this.senderEmail) {
      throw new InternalServerErrorException("SENDER_EMAIL is missing in environment variables");
    }
    // else if(!this.companyName){
    //   throw new InternalServerErrorException("COMPANY_NAME is missing in environment variables");
    // }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        to,
        from: {
          email: this.senderEmail,
          // name: this.companyName,
        },
        subject,
        html,
      };

      await sgMail.send(mailOptions);
      this.logger.debug('Email sent successfully to: ', to);
    } catch (error) {
      this.logger.error(`Failed to send email to: ${to}`, error.response?.body || error.message);
      throw new InternalServerErrorException("Email sending failed");
    }
  }
}
