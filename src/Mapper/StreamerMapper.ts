import { Announcement } from "../Model/Announcement";
import { BlobDataType } from "sequelize";
import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { AnnouncementDTO, AnnouncementMapper } from "./AnnouncementMapper";
import { CategorieDTO, CategoryMapper } from "./CategoryMapper";

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
    companyId: number;
    dateAcceptedByStreamer: Date;
    active: number;
    maxStreamer?: number;
    status: Boolean;
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
            announcements: streamerModel.dataValues.announcements?.map((an: Announcement) => {
                return {
                    id: an.id,
                    name: an.dataValues.name,
                    price: an.dataValues.price,
                    description: an.dataValues.description,
                    date: an.dataValues.date,
                    companyId: an.dataValues.companyId,
                    dateAcceptedByStreamer: an.dataValues.StreamerAnnouncement.createdAt,
                    active: an.dataValues.StreamerAnnouncement.active,
                    maxStreamer: an.dataValues.maxStreamer,
                    status: an.dataValues.status,
                };
            }),
            photo: streamerModel.dataValues.photo,
        };
    };
}
