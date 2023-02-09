import { Request, Response, Router } from "express";
import { UserMapper } from "../Mapper/UserMapper";
import { User } from "../Model/User";
import { UserService } from "../Service/UserService";

export const userRouter = Router();
const userService = new UserService();

userRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await userService.findAll();
        const usersDTO = users.map((user) => UserMapper.toDTO(user));
        return res.status(200).send(usersDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await userService.findById(req.body.id);
        if (!user) {
            return res.status(200).send(null);
        }
        return res.status(200).send(UserMapper.toDTO(user));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    try {
        const newUserRaw = {
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin,
        };

        const newUser = await userService.add(newUserRaw);
        return res.status(200).send(UserMapper.toDTO(newUser));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.post("/authenticate", async (req: Request, res: Response): Promise<Response> => {
    try {
        const authenticate = await userService.authenticate(req.body.username, req.body.password);
        return res.status(200).send(authenticate);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedUserRaw = {
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin,
        };
        const updatedUser = await userService.update(updatedUserRaw);
        return res.status(200).send(UserMapper.toDTO(updatedUser));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const deleted = await userService.delete(req.body.id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

userRouter.get("/getByUsername", async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.body);
        const user = await userService.findByUsername(req.body.username);
        if (!user) {
            return res.status(200).send(null);
        }

        return res.status(200).send(UserMapper.toDTO(user));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});
