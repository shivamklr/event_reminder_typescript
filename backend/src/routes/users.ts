import { Router } from "express";
import { createUser, loginUser } from "../controllers/user";
const route = Router();

// POST /users/login
route.post("/login", async (req, res) => {
    const {email, password} = req.body.user;
    try{
       const user = await loginUser({email, password})
       return res.status(200).json({user})
    }
    catch(e){
        console.log(e.message);
        res.status(422).json({errors:{body:['login failed', e.message]}})
    }

});

// POST /users
route.post("/", async (req, res) => {
    const { name, email, password } = req.body.user;
    console.log('user object received in req body');
    console.log({name, email, password});
    
    try {
        const user = await createUser({ name, email, password });
        
        return res.status(201).json({user});// TODO: remove password property from user object
    } catch (error) {
        console.log(error.message);
        return res
            .status(422)
            .json({ errors: { body: ["Could not create a user", error.message]} });
    }
});

export const usersRoute = route;
