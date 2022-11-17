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
import express, { Request, Response } from "express";
import connection from "./Model";
import { streamerRouter } from "./Controller/StreamerController";
import { categoryRouter } from "./Controller/CategoryController";
import { userRouter } from "./Controller/UserController";
import { announcementRouter } from "./Controller/AnnouncementController";
import { companyRouter } from "./Controller/CompanyController";

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/streamer", streamerRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/announcement", announcementRouter);
app.use("/company", companyRouter);

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
