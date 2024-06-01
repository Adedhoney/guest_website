import { Notification } from '@infrastructure/Notification';

export interface IforgotPasswordEmail {
    to: string;
    otp: string;
    fullName: string;
}

export interface IAccountNotification {
    forgotPasswordEmail(
        to: string,
        otp: string,
        firstName: string,
    ): Promise<void>;
}

export class AccountNotification
    extends Notification
    implements IAccountNotification
{
    public async forgotPasswordEmail(
        to: string,
        otp: string,
        firstName: string,
    ): Promise<void> {
        try {
            const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.cdnfonts.com/css/br-firma" rel="stylesheet" />
        <title>Reset-Otp</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: "BR Firma", sans-serif;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <table style="max-width: 600px; margin: 30px auto">
          <tr>
            <td>
              <svg width="37" height="41" viewBox="0 0 37 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="28.041" y="8.48047" width="7.42446" height="8.8335" fill="#EC7C30" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M36.2897 3C36.2897 1.34315 34.9466 0 33.2897 0H16.1914C14.5346 0 13.1914 1.34315 13.1914 3V31.4191C13.1914 33.076 14.5346 34.4191 16.1914 34.4191H33.2897C34.9466 34.4191 36.2897 33.076 36.2897 31.4191V3ZM26.043 3.44141C21.2907 3.44141 17.3594 7.2939 17.3594 12.0462C17.3594 16.7985 21.2907 20.651 26.043 20.651C30.7953 20.651 34.7266 16.7985 34.7266 12.0462C34.7266 7.2939 30.7953 3.44141 26.043 3.44141Z" fill="#2D75B6" />
                <rect x="0.492188" y="4.56445" width="30.3477" height="35.8062" rx="4.5" fill="white" stroke="black" />
                <line x1="5.76758" y1="15.8281" x2="20.6165" y2="15.8281" stroke="black" stroke-width="1.5" />
                <line x1="8.24219" y1="20.9805" x2="23.0911" y2="20.9805" stroke="black" stroke-width="1.5" />
                <line x1="8.24219" y1="26.1328" x2="18.1415" y2="26.1328" stroke="black" stroke-width="1.5" />
              </svg>
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="color: #23203d; font-size: 24px; font-weight: 600; margin: 30px 0;">Reset Password</h1>
              <p style="color: #23203d; font-size: 16px; font-weight: 600; line-height: 24px;">Hello ${firstName},</p>
              <p style="font-size: 16px; line-height: 24px; margin: 20px 0;">You requested a password reset on your guest website.</p>
              <p style="font-size: 16px; line-height: 24px; margin: 20px 0;">Here is your OTP pin.</p>
              <div style="display: flex; gap: 20px; margin-left: 50px;">
                <p style="width: 60px; height: 60px; border: 2px solid #2d75b6; border-radius: 5px; line-height: 60px; text-align: center; font-weight: bold; font-size: 22px;">${otp[0]}</p>
                <p style="width: 60px; height: 60px; border: 2px solid #2d75b6; border-radius: 5px; line-height: 60px; text-align: center; font-weight: bold; font-size: 22px;">${otp[1]}</p>
                <p style="width: 60px; height: 60px; border: 2px solid #2d75b6; border-radius: 5px; line-height: 60px; text-align: center; font-weight: bold; font-size: 22px;">${otp[2]}</p>
                <p style="width: 60px; height: 60px; border: 2px solid #2d75b6; border-radius: 5px; line-height: 60px; text-align: center; font-weight: bold; font-size: 22px;">${otp[3]}</p>
              </div>
              <p style="color: #23203d; font-size: 16px; line-height: 24px;">If you did not initiate this request, please ignore this email.</p>
              <p style="color: #23203d; font-size: 16px; font-weight: bold; margin: 30px 0;">Guest Team</p>
            </td>
          </tr>
        </table>
      
        <hr style="border: 1px solid #ebeeef; width: 100%; margin: 10px auto;" />
      
        <table style="max-width: 800px; margin: 20px auto;">
          <tr>
            <td align="center">
              <div style="width: 80px; height: 80px;">
              </div>
              <p style="color: #23203d; font-size: 16px; line-height: 24px; margin: 5px 0 10px 0;">Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</p>
              <p style="color: #23203d; font-size: 16px; line-height: 24px; margin: 20px 0;">Lorem ipsum dolor sit amet.</p>
              <p style="color: #23203d; font-size: 16px; line-height: 24px;">&copy;Guest Team</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
            `;

            const params = {
                to,
                message: '',
                subject: 'Password Reset',
                text: 'Use this OTP for your password reset',
                html: html,
            };

            await this.email(params);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
