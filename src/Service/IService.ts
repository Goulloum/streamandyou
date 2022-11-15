import { StreamerDTO } from "../Mapper/StreamerMapper";

export interface IService<T> {
    add(raw: any): Promise<T>;
    delete(id: number): Promise<Boolean>;
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(raw: any): Promise<T>;
}
