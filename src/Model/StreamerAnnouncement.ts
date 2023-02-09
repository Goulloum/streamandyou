import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Announcement } from "./Announcement";
import { Streamer } from "./Streamer";

@Table
export class StreamerAnnouncement extends Model {
    @ForeignKey(() => Streamer)
    @Column
    streamerId!: number;

    @ForeignKey(() => Announcement)
    @Column
    announcementId!: number;
}
