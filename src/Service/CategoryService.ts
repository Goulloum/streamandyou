import connection from "../Model";
import { Category } from "../Model/Category";
import { IService } from "./IService";

export class CategoryService implements IService<Category> {
    private categoryRepo = connection.getRepository(Category);

    private createQuery = () => {
        return {
            where: {},
        };
    };

    public async add(raw: any): Promise<Category> {
        const query = this.createQuery();
        query.where = { libelle: raw.libelle };

        const exist = await this.categoryRepo.findOne(query);
        if (exist) {
            throw new Error("Error this libelle is not unique, the category already exist");
        }

        const newCategory = await this.categoryRepo.create(raw);

        if (!newCategory) {
            throw new Error("Error while creating the category !");
        }

        return newCategory;
    }
    public async delete(id: number): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { id: id };

        const category = await this.categoryRepo.findOne(query);
        if (!category) {
            throw new Error("Category not found !");
        }

        const deleted = await this.categoryRepo.destroy(query);

        return !!deleted;
    }
    public async findById(id: number): Promise<Category | null> {
        const query = this.createQuery();
        query.where = { id: id };

        const category = await this.categoryRepo.findOne(query);

        return category;
    }
    public async findAll(): Promise<Category[]> {
        const categories = await this.categoryRepo.findAll();

        return categories;
    }
    public async update(raw: any): Promise<Category> {
        //Création d'un template sequelize pour insertion
        const categoryRaw = {
            libelle: raw.libelle,
        };

        //Création d'une query pour trouver selon l'id
        const query = this.createQuery();
        query.where = { id: raw.id };
        //Récupération de la categorie avec son id sinon erreur
        const oldCategory = await this.categoryRepo.findOne(query);

        if (!oldCategory) {
            throw new Error("Category not found !");
        }

        //Si les deux categorie son identique on update pas
        if (oldCategory.libelle === categoryRaw.libelle) {
            return oldCategory;
        }

        const update = await this.categoryRepo.update(categoryRaw, query);

        const newCategory = await this.categoryRepo.findOne(query);
        if (!newCategory) {
            throw new Error("Error while updating category !");
        }

        return newCategory;
    }
    public async findByLibelle(libelle: string): Promise<Category | null> {
        const query = this.createQuery();
        query.where = { libelle: libelle };

        const category = await this.categoryRepo.findOne(query);

        return category;
    }
}
