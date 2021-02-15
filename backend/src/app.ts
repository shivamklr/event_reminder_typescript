import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Event } from "./entity/Event";
import { usersRoute } from "./routes/users";
import { userRoute } from "./routes/user";
import './utils/password'
//creating an express instance
const app = express();
//body-parser
app.use(express.json());

//Routes middleware
app.use('/api/users', usersRoute)
app.use('/api/user', userRoute)

app.get("/", (req, res) => {
    res.send("Hello World");
});

async function start() {
    //connecting with the database
    try{
        await createConnection({
            type: "postgres",
            username:"xliwitks",
            url:
                "postgres://xliwitks:CNqdhMrzE_6EJhSD9xDR2sjVj5iJ54dP@rogue.db.elephantsql.com:5432/xliwitks",
            entities: [User, Event],
            synchronize: true,
            // dropSchema:true, //TODO: REMOVE BEFORE PRODUCTION
            // logging: true,
        });
        app.listen(8080, () => {
            console.log(`App running at port http://localhost:8080`);
        });
    }catch(e){
        console.log(e.message);    
    }
    
}
start();
