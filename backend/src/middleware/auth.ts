import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { authorization } = req.headers;
        console.log({ authorization });
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
        (req as any).user = loggedInUser;
        next();
    } catch (e) {
        console.log(e.message);
        return res
            .status(e.statusCode || 401)
            .json({ errors: { body: [e.message, "JWT Token is tampered"] } });
    }
}
