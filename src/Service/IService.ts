import { StreamerDTO } from "../Mapper/StreamerMapper";

export interface IService {
    add(raw: any): Promise<StreamerDTO>;
    delete(id: number): Promise<Boolean>;
    findById(id: number): Promise<StreamerDTO>;
    findAll(): Promise<StreamerDTO[]>;
    update(raw: any): Promise<StreamerDTO>;
}
