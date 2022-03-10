import { hash, compare } from "bcrypt";
import {SystemError} from "@kangojs/error-handler";

export class PasswordService {
    static HASH_ROUNDS = 10;

    static async hashPassword(password: string) {
        try {
            return await hash(password, PasswordService.HASH_ROUNDS);
        }
        catch (e) {
            throw new SystemError({
                message: "Error while hashing password",
                originalError: e
            })
        }
    }

    static async checkPassword(password: string, passwordHash: string) {
        try {
            return await compare(password, passwordHash);
        }
        catch (e) {
            throw new SystemError({
                message: "Error while hashing password",
                originalError: e
            })
        }
    }
}
