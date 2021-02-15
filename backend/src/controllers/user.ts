import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { hashFunction } from "../utils/password";

interface UserSignUpData {
    name: string;
    email: string;
    password: string;
}
export async function createUser({ name, email, password }: UserSignUpData) {
    if(!name){
        throw new Error("Name is empty");
    }
    if(!email){
        throw new Error("Email is empty");
    }
    if(!password){
        throw new Error("Password is empty");
    }
    try {
        let hashedPassword = await hashFunction(password);
        const user = await getRepository(User).save({
            name,
            email,
            password:hashedPassword,
        });
        console.log({ user });
        return user;
    } catch (e) {
        throw e;
    }
}
