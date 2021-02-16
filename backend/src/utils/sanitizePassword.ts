import { User } from "../entity/User";

export function SanitizeFields(arg:User):User{
    if(arg.password!==undefined) delete arg.password;
    return arg;
}