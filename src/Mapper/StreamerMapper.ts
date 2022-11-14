import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { CategorieDTO, CategoryMapper } from "./CategoryMapper";

export interface StreamerDTO {
    id: number;
    name: string;
    categories: CategorieDTO[];
}

export class StreamerMapper {
    public static toDTO = (streamerModel: Streamer): StreamerDTO => {
        return {
            id: streamerModel.id,
            name: streamerModel.dataValues.name,
            categories: streamerModel.dataValues.categories?.map((cat: Category) => CategoryMapper.toDTO(cat)),
        };
    };
}
