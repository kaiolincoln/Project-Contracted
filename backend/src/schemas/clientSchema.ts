import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),

    document: z.string().min(11, "CPF/CNPJ inválido").max(14, "CPF/CNPJ inválido"),

    email: z.string().email("Email inválido").optional(),

    phone: z.string().min(10, "Telefone inválido").optional(),

    address: z.string().optional(),
  })
});

export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().min(10, "Telefone inválido").optional(),
    address: z.string().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "Informe ao menos um campo para atualizar" }
  )
});