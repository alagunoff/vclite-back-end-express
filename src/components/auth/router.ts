import { Router } from "express";

import { logIn } from "./controllers";

const router = Router();

router.post("/login", logIn);

export default router;
