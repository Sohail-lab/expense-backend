import { Request, Response } from "express";
import crypto from "crypto";
import { executeQuery, executeTransaction, LOG } from "../helpers/helper.js";
import getUserByEmailQuery from "../db/queries/auth_queries/getUserByEmail.sql";
import getUserByGoogleIdQuery from "../db/queries/auth_queries/getUserByEmail.sql";
import updateUserSessionQuery from "../db/queries/auth_queries/updateUserSession.sql";
import createUserQuery from "../db/queries/auth_queries/createUser.sql";
import linkOrCreateGoogleUserQuery from "../db/queries/auth_queries/linkOrCreateGoogleUser.sql";
import { AuthenticatedRequest } from "../models/authRequest.model.js";
import { loginSuccessDetails, showMessage } from "../views/auth.view.js";

export const login = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    const user = await executeQuery(getUserByEmailQuery, [email]);
    if (!user || user.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordValid = password === user[0].password;
    if (!passwordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const sessionId = crypto.randomBytes(8).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await updateUserSession(user[0].user_id, sessionId, expiresAt);

    return res
      .status(200)
      .json(
        loginSuccessDetails(
          "Login successful",
          sessionId,
          expiresAt,
          user[0].user_id,
        ),
      );
  } catch (error: any) {
    LOG("Login error", true, error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const userId = req.userId as number;

    await updateUserSession(userId, null, null);

    return res.status(200).json(showMessage("Logout successful"));
  } catch (error) {
    return res.status(500).json({
      error: "Logout failed",
    });
  }
};

export const signUp = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body;
    await executeTransaction(createUserQuery, [
      name,
      email,
      password,
    ]);
    res.status(201).json(showMessage("User created successfully"));
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    // 1. Verify token with Google
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    if (!googleRes.ok) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const googleData = (await googleRes.json()) as any;
    const googleId: string = googleData.sub;
    const email: string = googleData.email;
    const name: string = googleData.name ?? email.split("@")[0];

    if (!googleId || !email) {
      return res.status(401).json({
        error: "Could not retrieve user info from token",
      });
    }

    // 2. Find user by google_id first, then fall back to email
    let userRows = await executeQuery(getUserByGoogleIdQuery, [googleId]);

    if (!userRows || userRows.length === 0) {
      userRows = await executeQuery(getUserByEmailQuery, [email]);

      await executeTransaction(linkOrCreateGoogleUserQuery, [
        name,
        email,
        googleId,
      ]);

      // if (userRows && userRows.length > 0) {
      //   // Link Google account to existing email user
      //   await updateUserGoogleIdQuery(userRows[0].user_id, googleId);
      // } else {
      //   // Register new Google-authenticated user
      //   await createGoogleUser(name, email, googleId);
      //   userRows = await getUserByGoogleIdQuery(googleId);
      // }
    }

    const user = userRows[0];

    // 3. Generate session
    const sessionId = crypto.randomBytes(8).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await updateUserSession(user.user_id, sessionId, expiresAt);

    return res.status(200).json(loginSuccessDetails(
      "Login successful",
      sessionId,
      expiresAt,
      user.user_id,
      email
    ));
  } catch (error: any) {
    LOG("Google login error", true, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserSession = async (
  userId: number,
  sessionId: string | null,
  expiresAt: Date | null,
) => {
  await executeQuery(updateUserSessionQuery, [sessionId, expiresAt, userId]);
};
