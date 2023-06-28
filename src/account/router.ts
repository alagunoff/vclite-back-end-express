import { Router } from "express";

import { register, verifyUser, logIn } from "./controllers";

const router = Router();

router.post("/registration", register);
router.get("/verification/:jwt", verifyUser);
router.post("/login", logIn);

export { router };
