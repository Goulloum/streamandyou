import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { AnnouncementCategory } from "./AnnouncementCategory";
import { Category } from "./Category";
import { Company } from "./Company";
import { Streamer } from "./Streamer";
import { StreamerAnnouncement } from "./StreamerAnnouncement";

@Table
export class Announcement extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.FLOAT)
    price!: number;

    @Column(DataType.TEXT)
    description!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    date!: Date;

    @Column(DataType.INTEGER)
    maxStreamer!: number;

    @Default(1)
    @Column(DataType.BOOLEAN)
    status!: Boolean;

    @BelongsToMany(() => Category, () => AnnouncementCategory)
    categories!: Category[];

    @BelongsToMany(() => Streamer, () => StreamerAnnouncement)
    streamers!: Streamer[];

    @ForeignKey(() => Company)
    @Column
    companyId!: number;

    @BelongsTo(() => Company)
    company!: Company;
}
