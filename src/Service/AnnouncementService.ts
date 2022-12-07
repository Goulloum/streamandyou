import connection from "../Model";
import { Announcement } from "../Model/Announcement";
import { AnnouncementCategory } from "../Model/AnnouncementCategory";
import { Category } from "../Model/Category";
import { Company } from "../Model/Company";
import { IService } from "./IService";

export class AnnouncementService implements IService<Announcement> {
    private announcementRepo = connection.getRepository(Announcement);
    private categoryRepo = connection.getRepository(Category);
    private companyRepo = connection.getRepository(Company);
    private announcementCategoryRepo = connection.getRepository(AnnouncementCategory);

    private createQuery = () => {
        return {
            where: {},
            include: [
                { model: this.categoryRepo, where: {}, required: false },
                { model: this.companyRepo, where: {}, required: false },
            ],
        };
    };

    public async setCategories(announcementId: number, categories: any[]): Promise<any> {
        categories.map(async (cat: any) => {
            //Check si la categorie existe bien sinon throw une erreur
            let existing = await this.categoryRepo.findOne({ where: { id: cat.id } });
            if (!existing) {
                throw new Error("Trying to add a non-existing category to streamer instance");
            }

            this.announcementCategoryRepo.create({
                announcementId: announcementId,
                categoryId: cat.id,
            });
        });
    }

    public async add(raw: any): Promise<Announcement> {
        //Creation d'une annonce sans relation avec les categories
        const announcementRaw = {
            name: raw.name,
            price: raw.price,
            description: raw.description,
            date: raw.date,
            companyId: raw.company.id,
        };

        const newAnnouncement = await this.announcementRepo.create(announcementRaw);

        //Creation des relations avec les categories si il y en a
        const categoriesRaw: any[] = raw.categories;

        if (categoriesRaw.length > 0) {
            await this.setCategories(newAnnouncement.id, categoriesRaw);
        }

        const query = this.createQuery();
        query.where = { id: newAnnouncement.id };

        const newAnnouncementCat = await this.announcementRepo.findOne(query);
        if (!newAnnouncementCat) {
            throw new Error("Error while creating announcement !");
        }

        return newAnnouncementCat;
    }
    public async delete(id: number): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { id: id };

        const exist = await this.announcementRepo.findOne(query);

        if (!exist) {
            throw new Error("Announcement not found !");
        }

        const deleted = await this.announcementRepo.destroy(query);

        return !!deleted;
    }
    public async findById(id: number): Promise<Announcement | null> {
        const query = this.createQuery();
        query.where = { id: id };

        const announcement = await this.announcementRepo.findOne(query);

        return announcement;
    }
    public async findAll(): Promise<Announcement[]> {
        const announcements = await this.announcementRepo.findAll();
        return announcements;
    }
    public async update(raw: any): Promise<Announcement> {
        const query = this.createQuery();
        query.where = { id: raw.id };

        const exist = await this.announcementRepo.findOne(query);

        if (!exist) {
            throw new Error("Announcement not found !");
        }

        const rawAnnouncementUpdate = {
            name: raw.name,
            price: raw.price,
            description: raw.description,
            date: raw.date,
            companyId: raw.company.id,
        };

        const updated = await this.announcementRepo.update(rawAnnouncementUpdate, query);
        //Update relation categories

        const rawAnnouncementCategories = raw.categories;

        if (raw.categories != exist.categories) {
            await this.announcementCategoryRepo.destroy({ where: { announcementId: exist.id } });

            await this.setCategories(exist.id, rawAnnouncementCategories);
        }

        const updatedAnnouncement = await this.announcementRepo.findOne(query);

        if (!updatedAnnouncement) {
            throw new Error("Error while updating the announcement !");
        }

        return updatedAnnouncement;
    }

    public async findByCompany(companyId: number): Promise<Announcement[]> {
        const query = this.createQuery();
        query.where = { companyId: companyId };

        const announcements = await this.announcementRepo.findAll(query);
        return announcements;
    }

    public async findRecent(limit: number | null): Promise<Announcement[]> {
        if (!limit) {
            const query: any = { ...this.createQuery(), order: [["date", "DESC"]] };
            const announcements = await this.announcementRepo.findAll(query);
            return announcements;
        } else {
            if (limit < 0) {
                throw new Error("Limit must be a positive number !");
            }
            if (!Number.isInteger(limit)) {
                throw new Error("Limit must be an integer !");
            }
            const query: any = { ...this.createQuery(), order: [["date", "DESC"]], limit: limit };

            const announcements = await this.announcementRepo.findAll(query);
            return announcements;
        }
    }
}
