import { Router } from "express";
import { createUser } from "../controllers/user";
const route = Router();

// POST /users/login
route.post("/login", (req, res) => {});

//POST /users
route.post("/", async (req, res) => {
    const { name, email, password } = req.body.user;
    console.log({name, email, password});
    
    try {
        const user = await createUser({ name, email, password });
        
        return res.status(201).json({ user: { ...user } });
    } catch (error) {
        console.log(error.message);
        return res
            .status(422)
            .json({ errors: { body: ["Could not create a user", error.message]} });
    }
});

export const usersRoute = route;
