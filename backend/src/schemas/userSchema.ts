// Arquivo para garantir que entre os dados que certos. ass: lincoln

import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name: z
        .string({ message: "Nome é obrigatório"})
        .min(3, {message: "Nome deve ter no mínimo 3 caracteres"}),
        email: z
        .string({ message: "Email é obrigatório"})
        .email({message: "Email inválido"}),
        password: z
        .string({ message: "Senha é obrigatória"})
        .min(6, {message: "Senha deve ter no mínimo 6 caracteres"}),
    })
});

export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "Precisa ser um email valido" }),
        password: z
        .string({ message: "A senha e obrigatoria" })
        .min(1, { message: "A senha e obrigatoria" }),
    })
})