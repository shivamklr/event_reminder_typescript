import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { verifyJWT } from "../utils/jwt";
import { SanitizeFields } from "../utils/sanitizePassword";

export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { authorization } = req.headers;
        if (authorization === undefined) {
            throw new Error("Header missing");
        }
        const [prefix, token] = authorization.split(" ");
        if (prefix !== "Token") {
            throw new Error("Header malformed");
        }
        const loggedInUser = await verifyJWT(token);
        if (loggedInUser === undefined) {
            throw new Error("Payload is missing");
        }
        (req as any).user = SanitizeFields(loggedInUser);
        next();
    } catch (e) {
        return ErrorResponse(res, e, 401, "Authentication Failed");
    }
}
