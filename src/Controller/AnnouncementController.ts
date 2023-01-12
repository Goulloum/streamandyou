import { Request, Response, Router } from "express";
import { AnnouncementMapper } from "../Mapper/AnnouncementMapper";
import { Announcement } from "../Model/Announcement";
import { AnnouncementService } from "../Service/AnnouncementService";

export const announcementRouter = Router();

const announcementService = new AnnouncementService();

announcementRouter.get("/getById", async (req: Request, res: Response): Promise<Response> => {
    try {
        const announcement = await announcementService.findById(req.body.id);

        if (!announcement) {
            return res.status(200).send(null);
        }
        return res.status(200).send(AnnouncementMapper.toDTO(announcement));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.get("/getAll", async (req: Request, res: Response): Promise<Response> => {
    try {
        const announcements = await announcementService.findAll();
        const announcementsDTO = announcements.map((announcement: Announcement) => AnnouncementMapper.toDTO(announcement));
        return res.status(200).send(announcementsDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.post("/add", async (req: Request, res: Response): Promise<Response> => {
    try {
        const rawAnnouncement = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            date: req.body.date,
            company: req.body.company,
            categories: req.body.categories,
        };

        const newAnnouncement = await announcementService.add(rawAnnouncement);
        return res.status(200).send(AnnouncementMapper.toDTO(newAnnouncement));
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.post("/delete", async (req: Request, res: Response): Promise<Response> => {
    try {
        const deleted = await announcementService.delete(req.body.id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.post("/update", async (req: Request, res: Response): Promise<Response> => {
    try {
        const updateRaw = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            date: req.body.date,
            company: req.body.company,
            categories: req.body.categories,
        };
        const update = await announcementService.update(updateRaw);
        return res.status(200).send(update);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.get("/getByCompany", async (req: Request, res: Response): Promise<Response> => {
    try {
        const announcements: Announcement[] = await announcementService.findByCompany(req.body.company.id);
        const announcementsDTO = announcements.map((announcement: Announcement) => AnnouncementMapper.toDTO(announcement));

        return res.status(200).send(announcementsDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.get("/getRecent", async (req: Request, res: Response): Promise<Response> => {
    try {
        const value = req.body.limit ? req.body.limit : null;
        const announcements = await announcementService.findRecent(value);
        const announcementsDTO = announcements.map((announcement) => AnnouncementMapper.toDTO(announcement));
        return res.status(200).send(announcementsDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});

announcementRouter.get("/getAllByOrder", async (req: Request, res: Response): Promise<Response> => {
    try {
        const streamers = await announcementService.findAllOrder(req.body.order, req.body.direction);

        const streamersDTO = streamers.map((announcement) => AnnouncementMapper.toDTO(announcement));
        return res.status(200).send(streamersDTO);
    } catch (err: any) {
        console.log(err);
        return res.status(301).send(err.message);
    }
});
