import connection from "../Model";
import { User } from "../Model/User";
import { PasswordUtility } from "../Utility/PasswordUtility";
import { IService } from "./IService";

export class UserService implements IService<User> {
    private createQuery = () => {
        return {
            where: {},
        };
    };

    private userRepo = connection.getRepository(User);

    public async add(raw: any): Promise<User> {
        const query = this.createQuery();
        query.where = { username: raw.username };
        const exist = await this.userRepo.findOne(query);
        if (!!exist) {
            throw new Error("Username already exist !");
        }
        const hash = await PasswordUtility.hashPassword(raw.password);

        const hashedUserRaw = {
            username: raw.username,
            password: hash,
            admin: raw.admin,
        };

        const newHashedUser = await this.userRepo.create(hashedUserRaw);
        if (!newHashedUser) {
            throw new Error("Error while creating new user !");
        }

        return newHashedUser;
    }
    public async delete(id: number): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { id: id };

        const exist = await this.userRepo.findOne(query);
        if (!exist) {
            throw new Error("User not found !");
        }

        const deleted = await this.userRepo.destroy(query);

        return !!deleted;
    }
    public async findById(id: number): Promise<User | null> {
        const query = this.createQuery();
        query.where = { id: id };

        const user = await this.userRepo.findOne(query);

        return user;
    }
    public async findAll(): Promise<User[]> {
        const users = await this.userRepo.findAll();

        return users;
    }
    public async update(raw: any): Promise<User> {
        const query = this.createQuery();
        query.where = { id: raw.id };

        const exist = await this.userRepo.findOne(query);
        if (!exist) {
            throw new Error("User not found !");
        }

        if (raw.username !== exist.dataValues.username) {
            const usernameExist = await this.findByUsername(raw.username);
            if (usernameExist) {
                throw new Error("Can't change user's username to already existing one !");
            }
        }

        const updatedUserRaw = raw;

        //Check si le mot de passe change et si oui on le re-hash
        const checkPassword = await PasswordUtility.comparePassword(raw.password, exist.dataValues.password);
        if (!checkPassword) {
            updatedUserRaw.password = await PasswordUtility.hashPassword(raw.password);
        }

        const update = await this.userRepo.update(updatedUserRaw, query);
        const updatedUser = await this.userRepo.findOne(query);
        if (!updatedUser) {
            throw new Error("User not found !");
        }

        return updatedUser;
    }

    public async findByUsername(username: string): Promise<User | null> {
        const query = this.createQuery();
        query.where = { username: username };

        const user = await this.userRepo.findOne(query);

        return user;
    }

    public async authenticate(username: string, password: string): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { username: username };

        const user = await this.userRepo.findOne(query);
        if (!user) {
            throw new Error("User not found !");
        }

        const authenticate = await PasswordUtility.comparePassword(password, user.dataValues.password);

        return authenticate;
    }
}
