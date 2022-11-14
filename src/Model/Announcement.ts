import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AnnouncementCategory } from "./AnnouncementCategory";
import { Category } from "./Category";
import { Company } from "./company";

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

    @BelongsToMany(() => Category, () => AnnouncementCategory)
    categories!: Category[];

    @ForeignKey(() => Company)
    @Column
    companyId!: number;

    @BelongsTo(() => Company)
    company!: Company;
}
