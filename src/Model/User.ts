import { AllowNull, Column, DataType, Model, Table, Unique } from "sequelize-typescript";

@Table
export class User extends Model {
    @AllowNull(false)
    @Column(DataType.STRING)
    username!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    admin!: boolean;
}
