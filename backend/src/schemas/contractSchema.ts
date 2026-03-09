import { z } from "zod";

export const createContractSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Título deve ter pelo menos 3 caracteres"),

    number: z
      .string()
      .min(1, "Número do contrato é obrigatório"),

    value: z
      .number("Valor deve ser um número" )
      .positive("Valor deve ser maior que zero"),

    startDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de início inválida"
      }),

    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de término inválida"
      }),

    clientId: z
      .string()
      .uuid("clientId inválido"),

    description: z
      .string()
      .optional(),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    {
      message: "Data de término deve ser maior que a data de início",
      path: ["endDate"]
    }
  )
});

export const updateContractSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Título deve ter pelo menos 3 caracteres")
      .optional(),

    value: z
      .number("Valor deve ser um número")
      .positive("Valor deve ser maior que zero")
      .optional(),

    startDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de início inválida"
      })
      .optional(),

    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de término inválida"
      })
      .optional(),

    clientId: z
      .string()
      .uuid("clientId inválido")
      .optional(),

    description: z
      .string()
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "Informe ao menos um campo para atualizar" }
  )
});

export const updateStatusContractSchema = z.object({
  body: z.object({
    status: z.string().refine(
      (val) => ["ACTIVE", "EXPIRED", "CANCELLED", "PENDING_RENEWAL"].includes(val),
      { message: "Status inválido. Use ACTIVE, EXPIRED, CANCELLED ou PENDING_RENEWAL" }
    )
  })
});