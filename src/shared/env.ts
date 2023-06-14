import { cleanEnv, str } from "envalid";

export default cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
  DATABASE_URL: str(),
});
