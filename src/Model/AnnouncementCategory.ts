import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Announcement } from "./Announcement";
import { Category } from "./Category";

@Table
export class AnnouncementCategory extends Model {
    @ForeignKey(() => Announcement)
    @Column
    announcementId!: number;

    @ForeignKey(() => Category)
    @Column
    categoryId!: number;
}
