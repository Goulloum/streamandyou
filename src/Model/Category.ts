import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Announcement } from "./Announcement";
import { AnnouncementCategory } from "./AnnouncementCategory";
import { Streamer } from "./Streamer";
import { StreamerCategory } from "./StreamerCategory";

@Table
export class Category extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    libelle!: string;

    @BelongsToMany(() => Streamer, () => StreamerCategory)
    streamers!: Streamer[];

    @BelongsToMany(() => Announcement, () => AnnouncementCategory)
    announcements!: Announcement;
}
