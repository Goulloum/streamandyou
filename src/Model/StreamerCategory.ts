import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "./Category";
import { Streamer } from "./Streamer";

@Table
export class StreamerCategory extends Model {
    @ForeignKey(() => Streamer)
    @Column
    streamerId!: number;

    @ForeignKey(() => Category)
    @Column
    categoryId!: number;
}
