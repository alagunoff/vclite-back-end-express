import { cleanEnv, str } from "envalid";
import * as dotenv from "dotenv";

dotenv.config();

export default cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
});
