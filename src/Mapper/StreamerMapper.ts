import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { CategorieDTO, CategoryMapper } from "./CategoryMapper";

export interface StreamerDTO {
    name: string;
    categories: CategorieDTO[];
}

export class StreamerMapper {
    public static toDTO = (streamerModel: Streamer): StreamerDTO => {
        return {
            name: streamerModel.dataValues.name,
            categories: streamerModel.dataValues.categories?.map((cat: Category) => CategoryMapper.toDTO(cat)),
        };
    };
}
