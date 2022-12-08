import { Announcement } from "../Model/Announcement";
import { Company } from "../Model/Company";
import { AnnouncementDTO, AnnouncementMapper } from "./AnnouncementMapper";

export interface CompanyDTO {
    id: number;
    name: string;
}

export interface CompanyDTOCount extends CompanyDTO {
    countAnnouncement: number;
}

export class CompanyMapper {
    public static toDTO = (companyModel: Company): CompanyDTO => {
        return {
            id: companyModel.id,
            name: companyModel.dataValues.name,
        };
    };

    public static toDTOCount = (companyModel: Company): CompanyDTOCount => {
        return {
            id: companyModel.id,
            name: companyModel.dataValues.name,
            countAnnouncement: companyModel.dataValues.nbAnnouncement,
        };
    };
}
