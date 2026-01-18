export const verificationEmailTemplate = (email, link) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#2563eb; padding:20px; color:#ffffff; text-align:center;">
                  <h2 style="margin:0;">RD Company</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${email}</strong>,</p>
                  
                  <p>
                    Thank you for signing up. Please verify your email address
                    by clicking the button below.
                  </p>

                  <p style="text-align:center; margin:40px 0;">
                    <a href="${link}"
                      style="
                        background:#2563eb;
                        color:#ffffff;
                        padding:12px 24px;
                        text-decoration:none;
                        border-radius:6px;
                        display:inline-block;
                        font-weight:bold;
                      ">
                      Verify Email
                    </a>
                  </p>

                  <p>
                    If the button doesn’t work, copy and paste this link
                    into your browser:
                  </p>

                  <p style="word-break:break-all;">
                    <a href="${link}">${link}</a>
                  </p>

                  <p style="margin-top:30px;">
                    This link will expire in 24 hours.
                  </p>

                  <p>
                    Thanks,<br />
                    <strong>RD Company Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                  © ${new Date().getFullYear()} RD Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export const rdAccountCreatedEmailTemplate = (userName, accountNumber) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>RD Account Created</title>
    </head>

    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#16a34a; padding:20px; color:#ffffff; text-align:center;">
                  <h2 style="margin:0;">RD Company</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${userName}</strong>,</p>

                  <p>
                    🎉 Congratulations! Your <strong>Recurring Deposit (RD)</strong>
                    account has been successfully created.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">
                        <strong>RD Account Number</strong>
                      </td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb; color:#2563eb; font-weight:bold;">
                        ${accountNumber}
                      </td>
                    </tr>
                  </table>

                  <p>
                    Please keep your RD account number safe. You will need it
                    for future deposits, payments, and support requests.
                  </p>

                  <p>
                    You can now start making your monthly RD payments and
                    track your passbook online.
                  </p>

                  <p style="margin-top:30px;">
                    If you have any questions, feel free to contact our support team.
                  </p>

                  <p>
                    Thanks & regards,<br />
                    <strong>RD Company Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                  © ${new Date().getFullYear()} RD Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export const paymentSuccessEmailTemplate = (
  userName,
  amount,
  date,
  rdNumber
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Payment Received</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#16a34a; padding:20px; color:#ffffff; text-align:center;">
                  <h2 style="margin:0;">RD Company</h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${userName}</strong>,</p>
                  
                  <p>
                    We have received your RD installment payment.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>RD Number</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${rdNumber}</td>
                    </tr>
                     <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Amount Paid</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">₹${amount}</td>
                    </tr>
                     <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Date</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${date}</td>
                    </tr>
                  </table>

                  <p>
                    Thank you for banking with us.
                  </p>

                  <p>
                    Regards,<br />
                    <strong>RD Company Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                  © ${new Date().getFullYear()} RD Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export const nomineeAddedEmailTemplate = (userName, nomineeName, accountNumber) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Nominee Added Successfully</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <tr>
                <td style="background:#16a34a; padding:20px; color:#ffffff; text-align:center;">
                  <h2 style="margin:0;">RD Company</h2>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${userName}</strong>,</p>
                  
                  <p>✅ Your nominee has been added successfully to your RD account.</p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Account Number</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${accountNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Nominee Name</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${nomineeName}</td>
                    </tr>
                  </table>

                  <p>You can now start your RD plan.</p>

                  <p>Regards,<br /><strong>RD Company Team</strong></p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                  © ${new Date().getFullYear()} RD Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export const rdStartedEmailTemplate = (userName, rdNumber, totalAmount, monthlyInstallment, duration, accountNumber) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>RD Started Successfully</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <tr>
                <td style="background:#2563eb; padding:20px; color:#ffffff; text-align:center;">
                  <h2 style="margin:0;">RD Company</h2>
                </td>
              </tr>

              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${userName}</strong>,</p>
                  
                  <p>🎉 Congratulations! Your Recurring Deposit has been started successfully.</p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0; border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>RD Number</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb; color:#2563eb; font-weight:bold;">${rdNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Account Number</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${accountNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Total Amount</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">₹${totalAmount}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Monthly Installment</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">₹${monthlyInstallment}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;"><strong>Duration</strong></td>
                      <td style="padding:12px; background:#f8fafc; border:1px solid #e5e7eb;">${duration} months</td>
                    </tr>
                  </table>

                  <p>Please ensure timely payment of your monthly installments to avoid late fees.</p>

                  <p>Thank you for choosing RD Company!<br /><strong>RD Company Team</strong></p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                  © ${new Date().getFullYear()} RD Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
