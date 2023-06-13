import * as dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
  NODE_ENV: str(),
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
});
