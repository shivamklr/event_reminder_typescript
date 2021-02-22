import { Between, getRepository } from "typeorm";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { SanitizeFields } from "../utils/sanitizePassword";

interface createEventData {
    title: string;
    description?: string;
    date: string;
}
interface updateEventData {
    id: number;
    title?: string;
    description?: string;
    date?: string;
}
export async function createEvent(
    { title, description, date }: createEventData,
    email: string
): Promise<Event> {
    // Data Validation
    if (title === undefined) {
        throw { message: "title missing from event", statusCode: 400 };
    }
    if (date === undefined) {
        throw { message: "date missing from event", statusCode: 400 };
    }
    try {
        // Find user from email
        const user = await getRepository(User).findOne({ email });
        if (user === undefined) {
            throw { message: "User does not exist" };
        }
        // create an event instance
        const event: Event = new Event(
            title,
            description,
            date,
            SanitizeFields(user)
        );
        // save the event instance into the db
        let eventCreated = await getRepository(Event).save(event);
        return eventCreated;
    } catch (e) {
        throw e;
    }
}

export async function updateEvent(
    { id, title, description, date }: updateEventData,
    email: string
): Promise<Event> {
    // Data validity
    if (
        id === undefined ||
        (title === undefined && description === undefined && date === undefined)
    ) {
        throw { message: "No data fields to update", statusCode: 400 };
    }
    const event = await getRepository(Event).findOne({ id });

    if (event === undefined) {
        throw { message: "Event with that id does not exist", statusCode: 400 };
    }
    console.log(event);

    if (event.authorEmail !== email) {
        throw { message: "Author and User mismatch", statusCode: 400 };
    }
    try {
        
        if (title !== undefined) {
            event.title = title;
        }
        if (description !== undefined) {
            event.description = description;
        }
        if (date !== undefined) {
            event.date = date;
        }
        const updatedEvent = await getRepository(Event).save(event);
        console.log({ updatedEvent });
        return updatedEvent as Event;
    } catch (e) {
        throw e;
    }
}
export async function getEventById(num: number, email: string): Promise<Event> {
    try {
        // Data validation
        if (num === undefined) {
            throw {
                message: "Did not provide a key to find the event",
                statusCode: 400,
            };
        }
        // Searching in the db
        const eventRow = await getRepository(Event).findOne({
            select: ["id", "title", "description", "date", "authorEmail"],
            where: { id: num },
        });
        // Confirming the existence
        if (eventRow === undefined) {
            throw {
                message: "Does not exist",
                statusCode: 404,
            };
        }
        // matching authors with the user
        if (email !== eventRow.authorEmail) {
            throw {
                message: "Author-User mismatch",
                statusCode: 401,
            };
        }
        return eventRow;
    } catch (e) {
        throw e;
    }
}
export async function getAllEventsByUser(
    to: string,
    from: string,
    email: string
): Promise<Event[]> {
    // Data Validation
    if(to === undefined){
        throw{message:"to not defined", statusCode:400};
    }
    if(from === undefined){
        throw{message:"from not defined", statusCode:400};
    }
    if(email === undefined){
        throw{message:"User does not found", statusCode:401};
    }
    try {
        // Confirm if user exist
        const user = await getRepository(User).findOne({
            select: ["email"],
            where: { email },
        });
        // User not found in db
        if (user === undefined) {
            throw { message: "User does not exist", statusCode: 422 };
        }
        // Find all rows where foreign key is email
        const eventRows = await getRepository(Event).find({
            select: ["title", "description", "date", "authorEmail"],
            where: { authorEmail: user.email, date: Between(from, to) },
        });
        return eventRows;
    } catch (e) {
        throw e;
    }
}
// export async function deleteEvent():Promise<Event>{
//     return new Event();
// }
