import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";
import { usersRoute } from "./routes/users";
import { userRoute } from "./routes/user";
//creating an express instance
const app = express();
//body-parser
app.use(express.json());

//Routes middleware
app.use("/api/users", usersRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});

async function start() {
    //connecting with the database
    try {
        await createConnection({
            type: "postgres",
            url:
                "postgres://lojgecoxlxnkvg:95886668f5c8add1cf6d7af4090b883aee8eccdb874a2bac919be19de40a339f@ec2-54-155-226-153.eu-west-1.compute.amazonaws.com:5432/d7h62rbad1gt05",
            entities: [User, Event],
            synchronize: true,
            dropSchema:true, //TODO: REMOVE BEFORE PRODUCTION
            logging: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        });
        app.listen(8080, () => {
            console.log(`App running at port http://localhost:8080`);
        });
    } catch (e) {
        console.log("error while connecting to db", e.message);
    }
}
start();
