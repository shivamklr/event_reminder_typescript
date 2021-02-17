import { Router } from "express";
import { createEvent } from "../controllers/events";
import { authenticateUser } from "../middleware/auth";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();
// POST /events     create a new event
route.post("/", authenticateUser, async (req, res) => {
    try {
        const data = req.body.event;
        const event = await createEvent(data, (req as any).user.email);
        return res.status(201).json({event});
    } catch (e) {
        return ErrorResponse(res, e, 422, "Error while creating an Event");
    }
});
export const eventsRoute = route;