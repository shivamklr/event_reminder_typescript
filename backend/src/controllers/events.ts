import { getRepository } from "typeorm";
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
        throw { message: "Event does not exist", statusCode: 400 };
    }
    console.log(event);

    if (event.author.email !== email) {
        throw { message: "Author and User mismatch", statusCode: 400 };
    }
    try {
        const newEvent = {};
        if (title !== undefined) {
            (newEvent as any).title = title;
        }
        if (description !== undefined) {
            (newEvent as any).description = description;
        }
        if (date !== undefined) {
            (newEvent as any).date = date;
        }
        const updatedEvent = await getRepository(Event).save(newEvent);
        console.log({ updatedEvent });
        return updatedEvent;
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
// export async function deleteEvent():Promise<Event>{
//     return new Event();
// }
// export async function updateEvent():Promise<Event>{
//     return new Event();
// }
// export async function getAllEventsByUser():Promise<Event[]>{
//     return [];
// }
