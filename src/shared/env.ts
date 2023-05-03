import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
});

export default env;
