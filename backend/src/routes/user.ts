import { Router } from "express";
import { fetchUserData } from "../controllers/user";
import { authenticateUser } from "../middleware/auth";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();

// GET /user    fetch data of a user
route.get("/", authenticateUser, async (req, res) => {
    // return user values
    try {
        const user = await fetchUserData((req as any).user);
        return res.status(200).json({ user });
    } catch (e) {
        return ErrorResponse(res, e, 422, "Could not fetch the use info");
        // console.log(e.message);
        // return res.status(e.statusCode || 422).json({errors:{body:["Could not fetch the user info", e.message]}});
    }
});
// PATCH /user    update a user
// TODO: create a route handler for patching user data
export const userRoute = route;
