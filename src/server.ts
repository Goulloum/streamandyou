import "reflect-metadata";
import express, { Request, Response } from "express";
import connection from "./Model";
import { streamerRouter } from "./Controller/StreamerController";
import { categoryRouter } from "./Controller/CategoryController";

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/streamer", streamerRouter);
app.use("/category", categoryRouter);

const start = async (): Promise<void> => {
    try {
        await connection.sync({ alter: process.env.PROFILE === "dev" });
        app.listen(8080, () => {
            console.log("Server started on port 3000");
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();
