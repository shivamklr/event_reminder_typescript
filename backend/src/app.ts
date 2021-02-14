import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";

//creating an express instance
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

async function start() {
    //connecting with the database
    await createConnection({
        type: "postgres",
        url:
            "postgres://xliwitks:CNqdhMrzE_6EJhSD9xDR2sjVj5iJ54dP@rogue.db.elephantsql.com:5432/xliwitks",
        entities: [User, Event],
        synchronize: true,
        logging: true,
    });
    app.listen(8080, () => {
        console.log(`App running at port http://localhost:8080`);
    });
}
start();
