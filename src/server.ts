/*
Copyrighted since I was born bitch
I tried to do something 
nice, readable and maitainable but 
obviously I failed.
Good luck to the next one

                                       
 (               (  (                  
 )\ )         (  )\ )\      (     )    
(()/(    (   ))\((_|(_)(   ))\   (     
 /(_))_  )\ /((_)_  _  )\ /((_)  )\  ' 
(_)) __|((_|_))(| || |((_|_))( _((_))  
  | (_ / _ \ || | || / _ \ || | '  \() 
   \___\___/\_,_|_||_\___/\_,_|_|_|_|  
                                       

              17/11/2022

*/
import "reflect-metadata";
import express from "express";
import connection from "./Model";
import { streamerRouter } from "./Controller/StreamerController";
import { categoryRouter } from "./Controller/CategoryController";
import { userRouter } from "./Controller/UserController";
import { announcementRouter } from "./Controller/AnnouncementController";
import { companyRouter } from "./Controller/CompanyController";
import cors from "cors";

require("dotenv").config();
const corsOptions: cors.CorsOptions = {
    origin: "*",
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());

app.use("/streamer", streamerRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/announcement", announcementRouter);
app.use("/company", companyRouter);

const start = async (): Promise<void> => {
    try {
        await connection.sync({ alter: process.env.PROFILE === "dev" });
        app.listen(process.env.SERVER_PORT, () => {
            console.log("Server started on port " + process.env.SERVER_PORT);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();
