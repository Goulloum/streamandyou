import { Category } from "../Model/Category";

export interface CategorieDTO {
    id: number;
    libelle: string;
}

export class CategoryMapper {
    public static toDTO = (categoryModel: Category): CategorieDTO => {
        return {
            id: categoryModel.id,
            libelle: categoryModel.dataValues.libelle,
        };
    };
}
