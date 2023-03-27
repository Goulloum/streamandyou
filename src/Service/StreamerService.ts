import { Op } from "sequelize";
import connection from "../Model";
import { Category } from "../Model/Category";
import { Streamer } from "../Model/Streamer";
import { StreamerCategory } from "../Model/StreamerCategory";
import { PasswordUtility } from "../Utility/PasswordUtility";
import { IService } from "./IService";
import jwt from "jsonwebtoken";
import { Announcement } from "../Model/Announcement";
import { StreamerAnnouncement } from "../Model/StreamerAnnouncement";

export class StreamerService implements IService<Streamer> {
    private streamerRepo = connection.getRepository(Streamer);

    private categoryRepo = connection.getRepository(Category);

    private announcementRepo = connection.getRepository(Announcement);

    private streamerAnnouncementRepo = connection.getRepository(StreamerAnnouncement);

    private streamerCategoryRepo = connection.getRepository(StreamerCategory);

    private createQuery = () => {
        return {
            where: {},
            include: [
                { model: this.categoryRepo, where: {}, required: false },
                { model: this.announcementRepo, where: {}, required: false },
            ],
        };
    };

    public async setCategories(streamerId: number, categories: any[]): Promise<any> {
        categories.map(async (cat: any) => {
            //Check si la categorie existe bien sinon throw une erreur
            let existing = await this.categoryRepo.findOne({ where: { id: cat.id } });
            if (!existing) {
                throw new Error("Trying to add a non-existing category to streamer instance");
            }

            this.streamerCategoryRepo.create({
                streamerId: streamerId,
                categoryId: cat.id,
            });
        });
    }

    public async add(raw: any): Promise<Streamer> {
        const newStreamerRaw = {
            name: raw.name,
            password: raw.password,
            email: raw.email,
            telephone: raw.telephone,
            sexe: raw.sexe,
            photo: raw.photo,
        };

        const exist = await this.streamerRepo.findOne({ where: { email: newStreamerRaw.email } });
        if (!!exist) {
            throw new Error("Email already exist !");
        }

        newStreamerRaw.password = await PasswordUtility.hashPassword(newStreamerRaw.password);

        const newStreamer = await this.streamerRepo.create(newStreamerRaw);

        //On isole la liste de categorie
        const categoriesRaw: any[] = raw.categories;
        if (categoriesRaw.length > 0) {
            await this.setCategories(newStreamer.id, categoriesRaw).catch((err: Error) => {
                throw new Error("Trying to add a non-existing category to streamer instance");
            });
        }
        const query = this.createQuery();
        query.where = { id: newStreamer.id };
        const result = await this.streamerRepo.findOne(query);
        if (!result) {
            throw new Error("Error while creating the streamer");
        }

        return result;
    }
    public async delete(id: number): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { id: id };

        //Check d'abord si le streamer existe
        const exist = await this.streamerRepo.findOne(query);

        if (!exist) {
            throw new Error("Streamer not found !");
        }
        //Requete de delete du streamer avec son id
        const deleted = await this.streamerRepo.destroy(query);

        return !!deleted;
    }
    public async findById(id: number): Promise<Streamer | null> {
        const query = this.createQuery();
        query.where = { id: id };
        const streamer = await this.streamerRepo.findOne(query);

        return streamer;
    }
    public async findAll(): Promise<Streamer[]> {
        const streamers = await this.streamerRepo.findAll(this.createQuery());

        return streamers;
    }
    public async update(raw: any): Promise<Streamer> {
        //On s'occupe d'abord du streamer pur
        const updatedStreamerRaw = {
            name: raw.name,
            password: raw.password,
            email: raw.email,
            telephone: raw.telephone,
            sexe: raw.sexe,
        };

        const exist = await this.streamerRepo.findOne({ where: { email: updatedStreamerRaw.email } });
        if (!!exist && exist.id !== raw.id) {
            throw new Error("Email already exist !");
        }

        const updatedCategoriesRaw: any[] = raw.categories;

        //Si le streamerId n'existe pas on renvoie une erreur
        const query = this.createQuery();
        query.where = { id: raw.id };
        const streamer = await this.streamerRepo.findOne(query);
        if (!streamer) {
            throw new Error("Streamer not found !");
        }

        if (streamer.dataValues.password !== updatedStreamerRaw.password) {
            updatedStreamerRaw.password = await PasswordUtility.hashPassword(updatedStreamerRaw.password);
        }
        //check si les categories ont besoin d'etre update
        if (streamer.categories !== updatedCategoriesRaw) {
            //destruction des lignes representant l'association entre le streamer et les categories
            await this.streamerCategoryRepo.destroy({ where: { streamerId: streamer.id } });
            //Création des nouvelles relations
            await this.setCategories(streamer.id, updatedCategoriesRaw);
        }
        //Update du streamer en lui-même
        const update = await this.streamerRepo.update(updatedStreamerRaw, { where: { id: streamer.id } });
        const updatedStreamer = await this.streamerRepo.findOne(query);
        if (!updatedStreamer) {
            throw new Error("Streamer not found");
        }
        return updatedStreamer;
    }

    public async findByName(name: string): Promise<Streamer | null> {
        const query = this.createQuery();
        query.where = { name: name };

        const streamer = await this.streamerRepo.findOne(query);

        return streamer;
    }

    public async findByCategories(categories: any): Promise<Streamer[]> {
        const categoriesId = categories.map((cat: any) => cat.id);

        const query = this.createQuery();
        query.include[0].where = { id: { [Op.in]: categoriesId } };

        const streamers = await this.streamerRepo.findAll(query);

        return streamers;
    }

    public async authenticate(email: string, password: string): Promise<{ user: Streamer; token: string }> {
        const query = this.createQuery();
        query.where = { email: email };
        const streamer = await this.streamerRepo.findOne(query);
        if (!streamer) {
            throw new Error("User not found !");
        }

        const authenticate = await PasswordUtility.comparePassword(password, streamer.dataValues.password);
        const token = jwt.sign({ streamer }, process.env.PRIVATE_KEY!, { expiresIn: 60 * 60 });

        if (!authenticate) {
            throw new Error("User not found !");
        }

        return {
            user: streamer,
            token: token,
        };
    }

    public async addAnnouncement(streamerId: number, announcementId: number): Promise<Streamer> {
        let existStreamer = await this.streamerRepo.findOne({ ...this.createQuery(), where: { id: streamerId } });
        if (!existStreamer) {
            throw new Error("Trying to add an announcement to a non-existing streamer !");
        }
        let existAnnouncement = await this.announcementRepo.findOne({ where: { id: announcementId } });
        if (!existAnnouncement) {
            throw new Error("Trying to add a non-existing announcement to a streamer !");
        }

        let existRelation = await this.streamerAnnouncementRepo.findOne({ where: { streamerId: streamerId, announcementId: announcementId } });
        if (!!existRelation) {
            return existStreamer;
        }

        let count = await this.streamerAnnouncementRepo.findAll({ where: { announcementId: announcementId } });
        if (existAnnouncement.maxStreamer && count.length > existAnnouncement.maxStreamer) {
            throw new Error("Max streamer count has already been fullfiled for this announcement !");
        }
        await this.streamerAnnouncementRepo.create({ streamerId: streamerId, announcementId: announcementId });

        const query = this.createQuery();
        query.where = { id: streamerId };
        const result = await this.streamerRepo.findOne(query);
        if (!result) {
            throw new Error("An error occured while binding the announcement with the streamer !");
        }

        return result;
    }
}
