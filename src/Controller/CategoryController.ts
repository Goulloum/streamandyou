import { Request, Response, Router } from "express";
import { CategoryMapper } from "../Mapper/CategoryMapper";
import connection from "../Model";
import { Category } from "../Model/Category";
import { CategoryService } from "../Service/CategoryService";

export const categoryRouter = Router();
const categoryService = new CategoryService();

const categoryRepo = connection.getRepository(Category);

//template de query pour les find sans inclure les models associés car inutiles
const createQuery = () => {
    return {
        where: {},
    };
};

//Route en GET pour récuperer toutes les catégories de la table
categoryRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await categoryService.findAll();

        //Formatte les categories en DTO
        const categoriesDTO = categories.map((cat) => CategoryMapper.toDTO(cat));

        return res.status(200).send(categoriesDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

categoryRouter.post("/getById", async (req: Request, res: Response): Promise<Response> => {
    try {
        const category = await categoryService.findById(req.body.id);
        if (!category) {
            return res.status(200).send(null);
        }
        return res.status(200).send(CategoryMapper.toDTO(category));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

categoryRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryRaw = {
            libelle: req.body.libelle,
        };
        const newCategory = await categoryService.add(categoryRaw);
        return res.status(200).send(CategoryMapper.toDTO(newCategory));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

categoryRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    try {
        const rawUpdate = {
            id: req.body.id,
            libelle: req.body.libelle,
        };

        const update = await categoryService.update(rawUpdate);
        return res.status(200).send(CategoryMapper.toDTO(update));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

categoryRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const deleted = await categoryService.delete(req.body.id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

categoryRouter.post("/getByLibelle", async (req: Request, res: Response): Promise<Response> => {
    try {
        const category = await categoryService.findByLibelle(req.body.libelle);
        if (!category) {
            return res.status(200).send(null);
        }
        return res.status(200).send(CategoryMapper.toDTO(category));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});
