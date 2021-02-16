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
interface UserJWTData{
    email:string;
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
            throw {message:"User with this email does not exist", statusCode:422};
        }
        const checkPass = await matchPassword(
            user.password as string,
            password
        );
        if (checkPass === false) {
            throw {message:"Password does not match", statusCode:401};
        }
        user.token = await createJWT(user);
        return SanitizeFields(user);
    } catch (e) {
        throw e;
    }
}
export async function fetchUserData({email}: UserJWTData):Promise<User>{
    try {
        const fetchedData = await getRepository(User).findOne({email});
        if(fetchedData === undefined){
            throw new Error("User of that email does not exist");
        }
        return SanitizeFields(fetchedData);
    } catch (e) {
        throw e;
    }
}