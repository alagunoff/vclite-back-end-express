import { createTransport } from "nodemailer";

import env from "./env";

export const transporter = createTransport({
  host: env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});
