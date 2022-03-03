import {sign, SignOptions, verify} from "jsonwebtoken";
import cron from "node-cron";


export class TokenService {
    secretKey: string;
    tokenBlacklist: string[] = [];
    blacklistPruneCron: string;

    constructor(secretKey: string, blacklistPruneCron: string) {
        this.secretKey = secretKey;
        this.blacklistPruneCron = blacklistPruneCron;

        // @todo: seperate into
        cron.schedule(this.blacklistPruneCron, this.pruneBlacklist)
    }

    createToken(data: Object, options: SignOptions) {
        return sign(data, this.secretKey, options);
    }

    isValidToken(token: string) {
        try {
            // verify will throw an error if it fails
            verify(token, this.secretKey);

            if (!this.tokenBlacklist.includes(token)) {
                return true;
            }
        }
        catch (err) {}

        return false;
    }

    addTokenToBlacklist(token: string) {
        this.tokenBlacklist.push(token);
    }

    pruneBlacklist() {
        this.tokenBlacklist = this.tokenBlacklist.filter(this.isValidToken)
    }
}