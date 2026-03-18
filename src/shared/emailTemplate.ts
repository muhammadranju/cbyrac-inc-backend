import {
  ICreateAccount,
  IResetPassword,
  ISendPdf,
} from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Toothlens Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const sendPdfTemplate = (values: ISendPdf) => {
  return {
    to: values.email,
    subject: values.data,
    html: `
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding:20px 0; background-color:#277E16;">
                  <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Company Logo" width="120" style="display:block;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  <h2 style="color:#333; text-align:center;">Your PDF Document is Ready</h2>
                  <p style="color:#555; font-size:16px; line-height:1.5;">
                    Hello, your requested document Link <a href="${
                      values.link
                    }" target="_blank">View PDF</a> is attached to this email. You can download it securely using the button below.
                  </p>
                  
                  <div style="text-align:center; margin:30px 0;">
                    <a href="${
                      values.link
                    }"target="_blank" rel="noopener noreferrer" style="background-color:#277E16; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold; display:inline-block;">
                      Download PDF
                    </a>
                  </div>

                  <p style="color:#888; font-size:14px; line-height:1.5;">
                    If you didn't request this document, please ignore this email or contact support.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px; text-align:center; font-size:12px; color:#aaa; background-color:#f4f4f4;">
                  &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    `,
  };
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  sendPdfTemplate,
};
