import { createTransport } from "nodemailer";

import { env } from "./env";

const emailSender = createTransport(
  {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: true,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  },
  {
    from: env.SMTP_SENDER,
  }
);

export { emailSender };
