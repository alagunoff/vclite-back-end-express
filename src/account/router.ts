import { Router } from "express";

import { verifyUser, logIn } from "./controllers";

const router = Router();

router.get("/verification/:jwt", verifyUser);
router.post("/login", logIn);

export { router };
