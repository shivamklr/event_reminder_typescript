import { Router } from "express";
import { createUser, loginUser } from "../controllers/users";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();

// POST /users/login
route.post("/login", async (req, res) => {
    const { email, password } = req.body.user;
    try {
        const user = await loginUser({ email, password });
        return res.status(200).json({ user });
    } catch (e) {
        return ErrorResponse(res, e, 422,"login failed");
        // console.log(e.message);
        // res.status(e.statusCode || 422).json({
        //     errors: { body: ["login failed", e.message] },
        // });
    }
});

// POST /users
route.post("/", async (req, res) => {
    const { name, email, password, dob } = req.body.user;
    console.log("==================user object received in req body=========");
    console.log({ name, email, password, dob });

    try {
        const user = await createUser({ name, email, password, dob });

        return res.status(201).json({ user });
    } catch (e) {
        return ErrorResponse(res, e, 422, "Could not create a user");
        // console.log(error.message);
        // return res.status(422).json({
        //     errors: { body: ["Could not create a user", error.message] },
        // });
    }
});

export const usersRoute = route;
