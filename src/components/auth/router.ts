import { Router } from "express";

import { logIn } from "./controllers";

const router = Router();

router.route("/login").post(logIn);

export default router;
