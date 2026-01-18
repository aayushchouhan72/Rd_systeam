import nodemailer from "nodemailer";

import {
  verificationEmailTemplate,
  rdAccountCreatedEmailTemplate,
  paymentSuccessEmailTemplate,
  nomineeAddedEmailTemplate,
  rdStartedEmailTemplate,
} from "./EmailTemplates.js";

export const sendMail = async (link, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // ✅ use 587
    secure: false, // ✅ false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mail = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    html: verificationEmailTemplate(email, link),
  });
};

export const rdRegisterUserMail = async (userName, accountNumber, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // ✅ use 587
    secure: false, // ✅ false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mail = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    html: rdAccountCreatedEmailTemplate(userName, accountNumber),
  });
};

export const sendPaymentSuccessEmail = async (
  email,
  userName,
  amount,
  date,
  rdNumber
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"RD Company" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Payment Confirmation - RD Installment",
    html: paymentSuccessEmailTemplate(userName, amount, date, rdNumber),
  });
};

export const sendNomineeAddedEmail = async (
  email,
  userName,
  nomineeName,
  accountNumber
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"RD Company" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Nominee Added Successfully - RD Account",
    html: nomineeAddedEmailTemplate(userName, nomineeName, accountNumber),
  });
};

export const sendRdStartedEmail = async (
  email,
  userName,
  rdNumber,
  totalAmount,
  monthlyInstallment,
  duration,
  accountNumber
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"RD Company" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "RD Started Successfully - Recurring Deposit",
    html: rdStartedEmailTemplate(
      userName,
      rdNumber,
      totalAmount,
      monthlyInstallment,
      duration,
      accountNumber
    ),
  });
};
