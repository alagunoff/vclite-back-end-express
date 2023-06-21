import { cleanEnv, str } from "envalid";

export default cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
  SMTP_HOST: str(),
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  SMTP_SENDER: str(),
});
