import { AllowNull, BelongsToMany, Column, DataType, Model, NotNull, Table } from "sequelize-typescript";
import { Category } from "./Category";
import { StreamerCategory } from "./StreamerCategory";

@Table
export class Streamer extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @BelongsToMany(() => Category, () => StreamerCategory)
    categories!: Category[];
}
