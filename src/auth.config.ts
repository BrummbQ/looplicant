import type { NextAuthConfig } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";

export default {
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        auth: {
          user: process.env.EMAIL_SMTP_LOGIN,
          pass: process.env.EMAIL_SMTP_PW,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
} satisfies NextAuthConfig;
