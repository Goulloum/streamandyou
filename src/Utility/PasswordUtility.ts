import * as bcrypt from "bcrypt";

export class PasswordUtility {
    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    public static async comparePassword(password: string, hash: string): Promise<Boolean> {
        return await bcrypt.compare(password, hash);
    }
}
