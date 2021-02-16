import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { createJWT } from "../utils/jwt";
import { hashFunction } from "../utils/password";

interface UserSignUpData {
    name: string;
    email: string;
    password: string;
}
export async function createUser({ name, email, password }: UserSignUpData) {
    //Check for data validity
    if(!name){
        throw new Error("Name is empty");
    }
    if(!email){
        throw new Error("Email is empty");
    }
    if(!password){
        throw new Error("Password is empty");
    }
    //Check for existing user
    const existing = await getRepository(User).findOne({email});
    if(existing) throw new Error("User already exist");
    // Save the user in the database
    try {
        let hashedPassword = await hashFunction(password);
        const user = await getRepository(User).save({
            name,
            email,
            password:hashedPassword,
        });
        // include jwt token property in user object 
        user.token = await createJWT(user);
        console.log({ user });
        return user;
    } catch (e) {
        throw e;
    }
}
