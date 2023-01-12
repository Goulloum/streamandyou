import { Request, Response, Router } from "express";
import { StreamerMapper } from "../Mapper/StreamerMapper";
import { Streamer } from "../Model/Streamer";
import { StreamerService } from "../Service/StreamerService";

export const streamerRouter = Router();
const streamerService = new StreamerService();

streamerRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    try {
        const streamers = await streamerService.findAll();
        const streamersDTO = streamers.map((streamer: Streamer) => StreamerMapper.toDTO(streamer));
        return res.status(200).send(streamersDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    try {
        const streamer = await streamerService.findById(req.body.id);
        if (!streamer) {
            return res.status(200).send(null);
        }
        return res.status(200).send(StreamerMapper.toDTO(streamer));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    try {
        const newStreamerRaw = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            telephone: req.body.telephone,
            sexe: req.body.sexe,
            categories: req.body.categories,
        };
        const newStreamer = await streamerService.add(newStreamerRaw);
        return res.status(200).send(StreamerMapper.toDTO(newStreamer));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    try {
        const updateRaw = {
            id: req.body.id,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            telephone: req.body.telephone,
            sexe: req.body.sexe,
            categories: req.body.categories,
        };
        const updatedStreamer = await streamerService.update(updateRaw);
        return res.status(200).send(StreamerMapper.toDTO(updatedStreamer));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.get("/getByName", async (req: Request, res: Response): Promise<Response> => {
    try {
        const streamer = await streamerService.findByName(req.body.name);
        if (!streamer) {
            return res.status(200).send(null);
        }
        return res.status(200).send(StreamerMapper.toDTO(streamer));
    } catch (err: any) {
        console.log(err);
        return res.send(301).send(err.message);
    }
});

streamerRouter.get("/getByCategories", async (req: Request, res: Response): Promise<Response> => {
    try {
        const streamers = await streamerService.findByCategories(req.body.categories);
        const streamersDTO = streamers.map((streamer: Streamer) => StreamerMapper.toDTO(streamer));
        return res.status(200).send(streamersDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const deleted = streamerService.delete(req.body.id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

streamerRouter.post("/authenticate", async (req: Request, res: Response): Promise<Response> => {
    try {
        const authenticate = await streamerService.authenticate(req.body.email, req.body.password);
        return res.status(200).send(authenticate);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});
