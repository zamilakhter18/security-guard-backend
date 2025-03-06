import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const msg = {
        to,
        from: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
        subject,
        text,
        html: html || text, // Use HTML if provided
      };

      await sgMail.send(msg);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }
}
