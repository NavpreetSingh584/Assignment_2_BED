import { Response } from "express";
import { ApiError, ApiList } from "./responses";


export const ok = <T>
                    (res: Response, data: T, message = "OK") =>
                    res.status(200).json({ success: true, message, data } as const);



export const created = <T>
                        (res: Response, data: T, message = "Created") =>
                         res.status(201).json({ success: true, message, data } as const);

export const listOk = <T>
                        (res: Response, items: T[], message = "OK", total?: number) => {
                        const payload: ApiList<T> = { success: true, message, data: items, total };
                        return res.status(200).json(payload);
};

export const notFound = 
                        (res: Response, message = "Not found") =>
                        res.status(404).json({ success: false, message } as ApiError);

export const badRequest =
                         (res: Response, message = "Bad request", errors?: ApiError["errors"]) =>
                        res.status(400).json({ success: false, message, errors } as ApiError);

export const serverError = 
                        (res: Response, message = "Internal server error") =>
                        res.status(500).json({ success: false, message } as ApiError);

export const noContent =
                         (res: Response) => res.status(204).send();
