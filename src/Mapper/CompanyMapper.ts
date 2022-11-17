import { Announcement } from "../Model/Announcement";
import { Company } from "../Model/Company";
import { AnnouncementDTO, AnnouncementMapper } from "./AnnouncementMapper";

export interface CompanyDTO {
    id: number;
    name: string;
    announcements: AnnouncementDTO[];
}

export class CompanyMapper {
    public static toDTO = (companyModel: Company): CompanyDTO => {
        return {
            id: companyModel.id,
            name: companyModel.dataValues.name,
            announcements: companyModel.dataValues.announcements?.map((announcement: Announcement) => AnnouncementMapper.toDTO(announcement)),
        };
    };
}
