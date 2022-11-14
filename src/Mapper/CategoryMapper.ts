import { Category } from "../Model/Category";

export interface CategorieDTO {
    libelle: string;
}

export class CategoryMapper {
    public static toDTO = (categoryModel: Category): CategorieDTO => {
        return {
            libelle: categoryModel.libelle,
        };
    };
}
