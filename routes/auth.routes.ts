import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { googleAuth, login, logout, signUp } from "../controllers/auth.controller";

export const createAuthRouter = (): Router => {
    const router = Router();

    router.post("/login", login);
    router.post("/signup", signUp);
    router.post("/logout", authenticate, logout);
    router.post("/google", googleAuth);

    return router;
};