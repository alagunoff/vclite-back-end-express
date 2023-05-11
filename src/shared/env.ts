import { cleanEnv, str } from "envalid";
import * as dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
});

export default env;
