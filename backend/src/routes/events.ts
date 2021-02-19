import { Router } from "express";
import { createEvent, updateEvent } from "../controllers/events";
import { authenticateUser } from "../middleware/auth";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();
// POST /api/events     create a new event
route.post("/", authenticateUser, async (req, res) => {
    try {
        if ((req as any).user === undefined) {
            throw { message: "User does not exist", statusCode:422 };
        }
        const data = req.body.event;
        const event = await createEvent(data, (req as any).user.email);
        return res.status(201).json({ event });
    } catch (e) {
        return ErrorResponse(res, e, 422, "Error while creating an Event");
    }
});
// PATCH /api/events    update an existing event
route.patch("/", authenticateUser, async (req, res) => {
    try {
        if ((req as any).user === undefined) {
            throw { message: "User does not exist", statusCode:422 };
        }
        console.log((req as any).user);
        
        const data = req.body.event;
        const event = await updateEvent(data, (req as any).user.email);
        return res.status(200).json(event);
    } catch (e) {
        return ErrorResponse(res, e, 400, "Could not update the event");
    }
});
export const eventsRoute = route;
