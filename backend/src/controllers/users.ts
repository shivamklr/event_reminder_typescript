import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { ErrorResponse } from "../utils/errorResponse";
import { createJWT } from "../utils/jwt";
import { hashFunction, matchPassword } from "../utils/password";
import { SanitizeFields } from "../utils/sanitizePassword";

interface UserSignUpData {
    name: string;
    email: string;
    password: string;
    dob?:string
}
interface UserLoginData {
    email: string;
    password: string;
}
interface UserJWTData {
    email: string;
}

interface UserUpdateData {
    name?: string;
    password?: string;
    dob?: string;
}
export async function createUser({
    name,
    email,
    password,
    dob
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
            dob
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
    // Data validity
    if (!email) {
        throw new Error("email is empty");
    }
    if (!password) {
        throw new Error("password is empty");
    }
    try {
        // Verify user in db
        const user = await getRepository(User).findOne({ email });
        if (user === undefined) {
            throw {
                message: "User/Password does not match",
                statusCode: 401,
            };
        }
        // Compare passwords
        const checkPass = await matchPassword(
            user.password as string,
            password
        );
        if (checkPass === false) {
            throw { message: "User/Password does not match", statusCode: 401 };
        }
        user.token = await createJWT(user);
        return user;
    } catch (e) {
        throw e;
    }
}
export async function fetchUserData({ email }: UserJWTData): Promise<User> {
    try {
        const fetchedData = await getRepository(User).findOne({ email });
        if (fetchedData === undefined) {
            throw new Error("User of that email does not exist");
        }
        return SanitizeFields(fetchedData);
    } catch (e) {
        throw e;
    }
}
export async function updateUserData(
    { name, password, dob }: UserUpdateData,
    email: string
): Promise<User> {
    try {
        const user = await getRepository(User).findOne(email);
        if (user === undefined)
            throw new Error("User with that email does not exist");
        if (dob !== undefined) {
            console.log(dob);
            user.dob = dob;
        }
        if (name !== undefined) user.name = name;
        if (password !== undefined)
            user.password = await hashFunction(password);
        const updatedUser = await getRepository(User).save(user);
        return SanitizeFields(updatedUser);
    } catch (e) {
        throw e;
    }
}
