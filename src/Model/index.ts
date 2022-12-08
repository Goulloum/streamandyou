import { Sequelize } from "sequelize-typescript";
import { Announcement } from "./Announcement";
import { AnnouncementCategory } from "./AnnouncementCategory";
import { Category } from "./Category";
import { Company } from "./Company";
import { Streamer } from "./Streamer";
import { StreamerCategory } from "./StreamerCategory";
import { User } from "./User";
require("dotenv").config();

console.log(process.env.DB_USER);

const connection = new Sequelize({
    repositoryMode: true,
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port: 7777,
    logging: false,
    models: [Streamer, StreamerCategory, Category, AnnouncementCategory, Announcement, Company, User],
});

export default connection;
