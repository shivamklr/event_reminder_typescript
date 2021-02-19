import { Router } from "express";
import { getEventById } from "../controllers/events";
import { authenticateUser } from "../middleware/auth";
import { ErrorResponse } from "../utils/errorResponse";
const route = Router();
// GET /api/event   find an event by the given id
route.get("/", authenticateUser, async (req, res) => {
    try {
        const data = req.body.event;
        if (data === undefined) {
            throw { message: "No data received", statusCode: 400 };
        }
        const eventObj = await getEventById(data.id, (req as any).user.email);
        return res.status(200).json({ event: eventObj });
    } catch (e) {
        return ErrorResponse(res, e, 422, "Could not find the event");
    }
});
export const eventRoute = route;
