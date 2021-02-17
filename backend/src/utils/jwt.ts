import jwt, { VerifyOptions } from "jsonwebtoken";
import { User } from "../entity/User";

const JWT_SECRET = "somethingverySecret"; // TODO: move to config file

export async function createJWT(payload: User): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                name: payload.name,
                email: payload.email,
            },
            JWT_SECRET,
            {expiresIn:30},
            (err: any, JWT_TOKEN: string | undefined) => {
                if (err) {
                    reject(err);
                }
                resolve(JWT_TOKEN as string);
            }
        );
    });
}
export async function verifyJWT(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            JWT_SECRET,
            (err: any, decoded: object | undefined) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded as User);
            }
        );
    });
}
// // TEST
// const test = async () => {
//     const user1 = new User();
//     user1.email = "abc@gmail.com";
//     user1.password = "passabc";
//     user1.name = "abcdef";
//     const jwtkey = await createJWT(user1);
//     const jwtdecoded = await verifyJWT(jwtkey);
//     console.log(`======for user1======`);
//     console.log({ user1 });
//     console.log(jwtkey);
//     console.log(`========decoded========`);
//     console.log({ jwtdecoded });
// };
// test();
