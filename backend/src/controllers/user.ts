import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { createJWT } from "../utils/jwt";
import { hashFunction, matchPassword } from "../utils/password";
import { SanitizeFields } from "../utils/sanitizePassword";

interface UserSignUpData {
    name: string;
    email: string;
    password: string;
}
interface UserLoginData {
    email: string;
    password: string;
}
export async function createUser({
    name,
    email,
    password,
}: UserSignUpData): Promise<User> {
    //Check for data validity
    if (!name) {
        throw new Error("Name is empty");
    }
    if (!email) {
        throw new Error("Email is empty");
    }
    if (!password) {
        throw new Error("Password is empty");
    }
    //Check for existing user
    const existing = await getRepository(User).findOne({ email });
    if (existing) throw new Error("User already exist");
    // Save the user in the database
    try {
        let hashedPassword = await hashFunction(password);
        const user = await getRepository(User).save({
            name,
            email,
            password: hashedPassword,
        });
        // include jwt token property in user object
        user.token = await createJWT(user);
        console.log({ user });
        return SanitizeFields(user);
    } catch (e) {
        throw e;
    }
}
export async function loginUser({
    email,
    password,
}: UserLoginData): Promise<User> {
    if (!email) {
        throw new Error("email is empty");
    }
    if (!password) {
        throw new Error("password is empty");
    }
    try {
        const user = await getRepository(User).findOne({ email });
        if (user === undefined) {
            throw new Error("User with this email does not exist");
        }
        const checkPass = await matchPassword(
            user.password as string,
            password
        );
        if (checkPass === false) {
            throw new Error("Password does not match");
        }
        user.token = await createJWT(user);
        return SanitizeFields(user);
    } catch (e) {
        throw e;
    }
}
