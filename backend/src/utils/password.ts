import bcrypt from "bcrypt";
const SALT_ROUNDS = 7;

// Hash the password 
export function hashFunction(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, (err, encrypted) => {
            if (err) return reject(err);
            resolve(encrypted);
        });
    });
}
export function matchPassword(
    encrypted: string,
    password: string
): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, encrypted, (err:any, same:boolean) => {
            if (err) return reject(err);
            return resolve(same);
        });
    });
}
