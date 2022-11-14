import { Request, Response, Router } from "express";
import { CategoryMapper } from "../Mapper/CategoryMapper";
import connection from "../Model";
import { Category } from "../Model/Category";

export const categoryRouter = Router();

const categoryRepo = connection.getRepository(Category);

//template de query pour les find sans inclure les models associés car inutiles
const createQuery = () => {
    return {
        where: {},
    };
};

//Route en GET pour récuperer toutes les catégories de la table
categoryRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    const categories = await categoryRepo.findAll();

    //Formatte les categories en DTO
    const categoriesDTO = categories.map((cat) => CategoryMapper.toDTO(cat));

    return res.status(200).send(categoriesDTO);
});

categoryRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    const query = createQuery();
    query.where = { id: req.body.id };

    const category = await categoryRepo.findOne(query);

    if (!category) {
        return res.status(301).send("No category found !");
    }

    return res.status(200).send(CategoryMapper.toDTO(category));
});

categoryRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    const categoryRaw = {
        libelle: req.body.libelle,
    };

    const newCategory = await categoryRepo.create(categoryRaw);

    if (!newCategory) {
        return res.status(301).send("Error while creating category");
    }

    return res.status(200).send(CategoryMapper.toDTO(newCategory));
});

categoryRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    //Création d'un template sequelize pour insertion
    const categoryRaw = {
        libelle: req.body.libelle,
    };

    //Création d'une query pour trouver selon l'id
    const query = createQuery();
    query.where = { id: req.body.id };
    //Récupération de la categorie avec son id sinon erreur
    const oldCategory = await categoryRepo.findOne(query);

    if (!oldCategory) {
        return res.status(301).send("Category not found !");
    }

    //Si les deux categorie son identique on update pas
    if (oldCategory.libelle === categoryRaw.libelle) {
        return res.status(200).send(CategoryMapper.toDTO(oldCategory));
    }

    const update = await categoryRepo.update(categoryRaw, query).catch((err: any) => {
        console.log(err);
        return res.status(301).send(err);
    });

    const newCategory = await categoryRepo.findOne(query);
    if (!newCategory) {
        return res.status(301).send("Error while updating !");
    }

    return res.status(200).send(CategoryMapper.toDTO(newCategory));
});

categoryRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    const query = createQuery();
    query.where = { id: req.body.id };

    const category = await categoryRepo.findOne(query);
    if (!category) {
        return res.status(301).send("Category not found!");
    }

    const deleted = await categoryRepo.destroy(query);

    return res.status(200).send(!!deleted);
});

categoryRouter.get("/getByLibelle", async (req: Request, res: Response): Promise<Response> => {
    const query = createQuery();
    query.where = { libelle: req.body.libelle };

    const category = await categoryRepo.findOne(query);
    if (!category) {
        return res.status(301).send("No category found !");
    }

    return res.status(200).send(CategoryMapper.toDTO(category));
});
