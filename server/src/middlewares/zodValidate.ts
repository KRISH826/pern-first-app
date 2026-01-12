import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const zodValidate =
    (schema: ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await schema.parseAsync(req.body);
                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    return res.status(422).json({
                        success: false,
                        message: err.issues.map(i => i.message),
                    });
                }
                next(err);
            }
        };
