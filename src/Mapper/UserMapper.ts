import { User } from "../Model/User";

export interface UserDTO {
    id: number;
    username: string;
    password: string;
    admin: boolean;
}

export class UserMapper {
    public static toDTO(user: User): UserDTO {
        return {
            id: user.id,
            username: user.dataValues.username,
            password: user.dataValues.password,
            admin: user.dataValues.admin,
        };
    }
}
