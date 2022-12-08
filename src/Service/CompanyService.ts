import connection from "../Model";
import { Announcement } from "../Model/Announcement";
import { Company } from "../Model/Company";
import { IService } from "./IService";

export class CompanyService implements IService<Company> {
    private companyRepo = connection.getRepository(Company);
    private announcementRepo = connection.getRepository(Announcement);

    private createQuery = () => {
        return {
            where: {},
            include: [{ model: this.announcementRepo, where: {}, required: false, attributes: [] }],
        };
    };

    public async add(raw: any): Promise<Company> {
        const query = this.createQuery();
        query.where = { name: raw.name };

        const exist = await this.companyRepo.findOne(query);
        if (!!exist) {
            throw new Error("Company name is already taken !");
        }

        const newCompany = await this.companyRepo.create(raw);
        if (!newCompany) {
            throw new Error("Error while creating company !");
        }

        return newCompany;
    }
    public async delete(id: number): Promise<Boolean> {
        const query = this.createQuery();
        query.where = { id: id };

        const exist = await this.companyRepo.findOne(query);
        if (!exist) {
            throw new Error("Company not found !");
        }

        const deleted = await this.companyRepo.destroy(query);

        return !!deleted;
    }
    public async findById(id: number): Promise<Company | null> {
        const query = this.createQuery();
        query.where = { id: id };

        const company = await this.companyRepo.findOne(query);

        return company;
    }
    public async findAll(): Promise<Company[]> {
        const companies = await this.companyRepo.findAll();

        return companies;
    }
    public async update(raw: any): Promise<Company> {
        const query = this.createQuery();
        query.where = { id: raw.id };

        const exist = await this.companyRepo.findOne(query);
        if (!exist) {
            throw new Error("Company not found !");
        }

        const updated = await this.companyRepo.update(raw, query);
        if (!updated) {
            throw new Error("Error while updating !");
        }

        const updatedCompany = await this.companyRepo.findOne(query);
        if (!updatedCompany) {
            throw new Error("Error while updating !");
        }
        return updatedCompany;
    }

    public async findByName(name: string): Promise<Company | null> {
        const query = this.createQuery();
        query.where = { name: name };

        const company = await this.companyRepo.findOne(query);
        return company;
    }
    public async findMostActiveCompany(): Promise<any> {
        const query: any = {
            attributes: { include: [[connection.Sequelize.fn("COUNT", connection.Sequelize.col("announcements.companyId")), "nbAnnouncement"]] },
            include: [{ model: this.announcementRepo, attributes: [] }],
            group: ["announcements.companyId"],
            order: [["nbAnnouncement", "DESC"]],
        };
        const companies = await this.companyRepo.findAll(query);
        return companies;
    }
}
