import { Router } from "express";

import { verifyAccount, logIn } from "./controllers";

const router = Router();

router.get("/verification/:jwt", verifyAccount);
router.post("/login", logIn);

export { router };
