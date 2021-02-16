import { Router } from "express";
import { fetchUserData } from "../controllers/user";
import { authenticateUser } from "../middleware/auth";
const route = Router();

// GET /user    fetch data of a user
route.get("/", authenticateUser, async (req, res) => {
    // return user values
    try {
        const user = await fetchUserData((req as any).user);
        return res.status(200).json({ user });
    } catch (e) {
        console.log(e.message);
        return res.status(e.statusCode || 422);
    }
});
// PATCH /user    update a user
// TODO: create a route handler for patching user data
export const userRoute = route;
