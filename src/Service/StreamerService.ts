import { StreamerDTO } from "../Mapper/StreamerMapper";
import { IService } from "./IService";

export class StreamerService implements IService {
    add(raw: any): Promise<StreamerDTO> {}
    delete(id: number): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<StreamerDTO> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<StreamerDTO[]> {
        throw new Error("Method not implemented.");
    }
    update(raw: any): Promise<StreamerDTO> {
        throw new Error("Method not implemented.");
    }
}
