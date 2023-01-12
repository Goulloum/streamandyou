import { AllowNull, BelongsToMany, Column, DataType, Model, NotNull, Table } from "sequelize-typescript";
import { Category } from "./Category";
import { StreamerCategory } from "./StreamerCategory";

@Table
export class Streamer extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    telephone!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    sexe!: string;

    @BelongsToMany(() => Category, () => StreamerCategory)
    categories!: Category[];
}
