import { Router } from "express";
import { fetchUserData, updateUserData } from "../controllers/users";
import { authenticateUser } from "../middleware/auth";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();

// GET /user    fetch data of a user
route.get("/", authenticateUser, async (req, res) => {
    // return user values
    try {
        const user = await fetchUserData((req as any).user.email);
        return res.status(200).json({ user });
    } catch (e) {
        return ErrorResponse(res, e, 422, "Could not fetch the use info");
        // console.log(e.message);
        // return res.status(e.statusCode || 422).json({errors:{body:["Could not fetch the user info", e.message]}});
    }
});
// PATCH /user    update a user
route.patch("/", authenticateUser, async (req, res) => {
    try {
        const user = await updateUserData(req.body.user, (req as any).user.email);
        return res.status(200).json({user});
    } catch (e) {
        return ErrorResponse(
            res,
            e,
            422,
            "Something went wrong while updating"
        );
    }
});
// TODO: create a route handler for patching user data
export const userRoute = route;
