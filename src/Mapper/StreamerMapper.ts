import { Announcement } from "../Model/Announcement";
import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { CategorieDTO, CategoryMapper } from "./CategoryMapper";
import { CompanyDTO, CompanyMapper } from "./CompanyMapper";

export interface StreamerDTO {
    id: number;
    name: string;
    password: string;
    email: string;
    telephone: string;
    sexe: string;
    categories: CategorieDTO[];
    photo: string;
    announcements: AnnouncementStreamerDTO[];
}

interface AnnouncementStreamerDTO {
    id: number;
    name: string;
    price: number;
    description: string;
    date: Date;
    company: CompanyDTO;
    dateAcceptedByStreamer: Date;
    active: number;
    maxStreamer?: number;
    status: Boolean;
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
            announcements: streamerModel.dataValues.announcements?.map((an: any): AnnouncementStreamerDTO => {
                return {
                    id: an.id,
                    name: an.dataValues.name,
                    price: an.dataValues.price,
                    description: an.dataValues.description,
                    date: an.dataValues.date,
                    company: CompanyMapper.toDTO(an.dataValues.company),
                    dateAcceptedByStreamer: an.dataValues.StreamerAnnouncement.createdAt,
                    active: an.dataValues.StreamerAnnouncement.dataValues.active,
                    maxStreamer: an.dataValues.maxStreamer,
                    status: an.dataValues.status,
                    categories: an.dataValues.categories?.map((cat: Category): CategorieDTO => CategoryMapper.toDTO(cat)),
                };
            }),
            photo: streamerModel.dataValues.photo,
        };
    };
}
