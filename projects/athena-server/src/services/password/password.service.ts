import {hash, compare, genSalt} from "bcrypt";
import {SystemError} from "@kangojs/core";

export class PasswordService {
    static SALT_ROUNDS = 10;

    static async hashPassword(password: string) {
        try {
            return await hash(password, PasswordService.SALT_ROUNDS);
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
                message: "Error while checking password hash",
                originalError: e
            })
        }
    }
}
