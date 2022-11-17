import { Request, Response, Router } from "express";
import { CompanyMapper } from "../Mapper/CompanyMapper";
import { Company } from "../Model/Company";
import { CompanyService } from "../Service/CompanyService";

export const companyRouter = Router();

const companyService = new CompanyService();

companyRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    try {
        const companies = await companyService.findAll();
        const companiesDTO = companies.map((company: Company) => CompanyMapper.toDTO(company));
        return res.status(200).send(companiesDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

companyRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    try {
        const company = await companyService.findById(req.body.id);
        if (!company) {
            return res.status(200).send(null);
        }

        return res.status(200).send(CompanyMapper.toDTO(company));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

companyRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyRaw = {
            name: req.body.name,
        };

        const newCompany = await companyService.add(companyRaw);
        return res.status(200).send(newCompany);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

companyRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const deleted = await companyService.delete(req.body.id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

companyRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyRaw = {
            id: req.body.id,
            name: req.body.name,
        };
        const updatedCompany = await companyService.update(companyRaw);
        return res.status(200).send(CompanyMapper.toDTO(updatedCompany));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

companyRouter.get("/getByName", async (req: Request, res: Response): Promise<Response> => {
    try {
        const company = await companyService.findByName(req.body.name);
        if (!company) {
            return res.status(200).send(null);
        }
        return res.status(200).send(CompanyMapper.toDTO(company));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});
