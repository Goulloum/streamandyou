import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { CategorieDTO, CategoryMapper } from "./CategoryMapper";

interface StreamerDTO {
    id: number;
    name: string;
    password: string;
    email: string;
    telephone: string;
    sexe: string;
    categories: CategorieDTO[];
}

export class StreamerMapper {
    public static toDTO = (streamerModel: Streamer): StreamerDTO => {
        return {
            id: streamerModel.id,
            name: streamerModel.dataValues.name,
            password: streamerModel.dataValues.password,
            email: streamerModel.dataValues.email,
            telephone: streamerModel.dataValues.telephone,
            sexe: streamerModel.dataValues.sexe,
            categories: streamerModel.dataValues.categories?.map((cat: Category) => CategoryMapper.toDTO(cat)),
        };
    };
}
