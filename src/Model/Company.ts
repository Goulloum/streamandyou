import { AllowNull, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Announcement } from "./Announcement";

@Table
export class Company extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @HasMany(() => Announcement)
    announcements!: Announcement;
}
