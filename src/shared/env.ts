import { cleanEnv, str, num } from "envalid";

const env = cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
  SMTP_HOST: str(),
  SMTP_PORT: num(),
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  SMTP_SENDER: str(),
});

export { env };
