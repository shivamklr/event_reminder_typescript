import { Response } from "express";

interface error {
    message: string;
    statusCode?: number;
}
export function ErrorResponse(res: Response, e: error, statusCode:number,message?: string) {
    console.log(e.message);
    if(e.statusCode !== undefined){
        statusCode = e.statusCode;
    }
    return res.status(statusCode).json({
        errors: { body: [message, e.message] },
    });
}
