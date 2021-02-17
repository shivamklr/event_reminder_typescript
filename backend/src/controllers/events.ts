import { getRepository } from "typeorm";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { SanitizeFields } from "../utils/sanitizePassword";

interface createEventData{
    title:string;
    description?:string;
    date:string;
}
export async function createEvent({title, description, date}:createEventData, email:string):Promise<Event>{
    // Data Validation
    if(title === undefined){
        throw {message:"title missing from event", statusCode: 400}
    }
    if(date === undefined){
        throw {message:"date missing from event"}
    }
    try {
        // Find user from email
        const user = await getRepository(User).findOne({email})
        if(user === undefined){
            throw {message:"User does not exist"}
        }
        // create an event instance 
        const event:Event = new Event(title,description, date, SanitizeFields(user));
        // save the event instance into the db
        const eventCreated = await getRepository(Event).save(event);
        if(eventCreated === undefined) throw{};
        return eventCreated;
    } catch (e) {
        throw e;
    }
}
// export async function deleteEvent():Promise<Event>{
//     return new Event();
// }
// export async function updateEvent():Promise<Event>{
//     return new Event();
// }
// export async function getAllEventsByUser():Promise<Event[]>{
//     return [];
// }
// export async function getEventById():Promise<Event>{
//     return new Event();
// }
