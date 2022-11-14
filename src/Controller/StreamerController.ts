import { Request, Response, Router } from "express";
import { StreamerMapper } from "../Mapper/StreamerMapper";
import connection from "../Model";
import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";

export const streamerRouter = Router();

const categoryRepo = connection.getRepository(Category);
const streamerRepo = connection.getRepository(Streamer);

const createQuery = () => {
    return {
        where: {},
        include: [categoryRepo],
    };
};

streamerRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    const streamers = await streamerRepo.findAll(createQuery());
    const streamersDTO = streamers.map((streamer) => StreamerMapper.toDTO(streamer));

    return res.status(200).send(streamersDTO);
});

streamerRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    const query = createQuery();
    query.where = { id: req.body.id };
    const streamer = await streamerRepo.findOne(query);

    if (!streamer) {
        console.log("No streamer found !");
        return res.status(301).send("No streamer found");
    }

    return res.status(200).send(StreamerMapper.toDTO(streamer));
});

streamerRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    return res.status(301).send();
});
