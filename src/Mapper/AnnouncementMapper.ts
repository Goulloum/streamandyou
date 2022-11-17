import { CategorieDTO, CategoryMapper } from "./CategoryMapper";
import { Announcement } from "../Model/Announcement";
import { Category } from "../Model/Category";
import { CompanyDTO, CompanyMapper } from "./CompanyMapper";

export interface AnnouncementDTO {
    id: number;
    name: string;
    price: number;
    description: string;
    date: Date;
    categories: CategorieDTO[];
    company: CompanyDTO;
}

export class AnnouncementMapper {
    public static toDTO = (announcementModel: Announcement): AnnouncementDTO => {
        return {
            id: announcementModel.id,
            name: announcementModel.dataValues.name,
            price: announcementModel.dataValues.price,
            description: announcementModel.dataValues.description,
            date: announcementModel.dataValues.date,
            categories: announcementModel.dataValues.categories?.map((cat: Category) => CategoryMapper.toDTO(cat)),
            company: CompanyMapper.toDTO(announcementModel.dataValues.company),
        };
    };
}
