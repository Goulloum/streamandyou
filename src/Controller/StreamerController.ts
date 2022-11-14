import { Request, Response, Router } from "express";
import { StreamerMapper } from "../Mapper/StreamerMapper";
import connection from "../Model";
import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { StreamerCategory } from "../Model/StreamerCategory";

export const streamerRouter = Router();

const categoryRepo = connection.getRepository(Category);
const streamerRepo = connection.getRepository(Streamer);
const streamerCategoryRepo = connection.getRepository(StreamerCategory);

const createQuery = () => {
    return {
        where: {},
        include: [{ model: categoryRepo, where: {} }],
    };
};

//Vu que sequelize c'est de la merde on peut automatiquement créer la relation
//entre deux model dans la table intermédiaire ducoup je le fais à la main
const setCategories = async (streamerId: number, categories: any): Promise<any> => {
    categories.map(async (cat: any) => {
        //Check si la categorie existe bien sinon throw une erreur
        let existing = await categoryRepo.findOne({ where: { id: cat.id } });
        if (!existing) {
            throw new Error("Trying to add a non-existing category to streamer instance");
        }

        streamerCategoryRepo.create({
            streamerId: streamerId,
            categoryId: cat.id,
        });
    });
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
    //On récupère uniquement le streamer pas les categories et on le créer solo
    const newStreamerRaw = {
        name: req.body.name,
    };
    const newStreamer = await streamerRepo.create(newStreamerRaw);

    //On isole la liste de categorie
    const categoriesRaw: any[] = req.body.categories;
    if (categoriesRaw) {
        setCategories(newStreamer.id, categoriesRaw).catch((err: Error) => {
            return res.status(301).send(err);
        });
    }
    const query = createQuery();
    query.where = { id: newStreamer.id };
    const result = await streamerRepo.findOne(query);
    if (!result) {
        return res.status(301).send("Error while creating the streamer !");
    }

    return res.status(200).send(StreamerMapper.toDTO(result));
});

streamerRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    //On s'occupe d'abord du streamer pur
    const updatedStreamerRaw = {
        name: req.body.name,
    };

    const updatedCategoriesRaw: any[] = req.body.categories;

    //Si le streamerId n'existe pas on renvoie une erreur
    const query = createQuery();
    query.where = { id: req.body.id };
    const streamer = await streamerRepo.findOne(query);
    if (!streamer) {
        return res.status(301).send("Streamer not found !");
    }

    if (streamer.categories !== updatedCategoriesRaw) {
        streamerCategoryRepo.destroy({ where: { streamerId: streamer.id } });
        setCategories(streamer.id, updatedCategoriesRaw).catch((err) => {
            console.log(err);
            return res.status(301).send(err);
        });
    }
    const updatedStreamer = await streamerRepo.update(updatedStreamerRaw, { where: { id: streamer.id } });
    if (updatedStreamer) {
        const result = await streamerRepo.findOne(query);
        if (!result) {
            return res.status(301).send("Error while updating !");
        }
        return res.status(200).send(StreamerMapper.toDTO(result));
    }

    return res.status(200).send(StreamerMapper.toDTO(streamer));
});

streamerRouter.get("/findByName", async (req: Request, res: Response): Promise<Response> => {
    const query = createQuery();
    query.where = { name: req.body.name };

    const streamers = await streamerRepo.findAll(query);
    const streamersDTO = streamers.map((st: Streamer) => StreamerMapper.toDTO(st));

    return res.status(200).send(streamersDTO);
});

streamerRouter.get("/findByCategories", async (req: Request, res: Response): Promise<Response> => {
    const categoriesId = req.body.categories.map((cat: any) => cat.id);

    const query = createQuery();
    query.include[0].where = { id: 1 };

    const streamers = await streamerRepo.findAll(query).catch((err: any) => {
        console.log(err);
        return res.status(301).send(err);
    });

    return res.status(200).send(streamers);
});
