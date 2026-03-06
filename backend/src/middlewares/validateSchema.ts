// Arquivo para validaçao dos dados do schema. ass: lincoln

import { ZodType, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateSchema = 
(schema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        })
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
               error: "Dados inválidos",
               details: error.issues.map((issue) => ({
                campo: issue.path.join("."),
                message: issue.message,
               })),      
            });
        }

        return res.status(500).json({ 
            error: "Erro interno do servidor"   
         });
    }
}