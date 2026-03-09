// Arquivo para garantir que entrem os dados certos. ass: lincoln

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

export const updateUserSchema = z.object({
    body: z.object({
      name: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .optional(),
  
      email: z
        .string()
        .email("Email inválido")
        .optional(),
    })
    .refine(
      (data) => data.name !== undefined || data.email !== undefined,
      { message: "Informe ao menos nome ou email para atualizar" }
    )
  });

export const changePasswordSchema = z.object({
    body: z.object({
      currentPassword: z
        .string()
        .min(1, "Senha atual é obrigatória"),
  
      newPassword: z
        .string()
        .min(6, "Nova senha deve ter pelo menos 6 caracteres")
        .regex(/[A-Z]/, "Nova senha deve ter pelo menos uma letra maiúscula")
        .regex(/[0-9]/, "Nova senha deve ter pelo menos um número"),
  
      confirmPassword: z
        .string()
        .min(1, "Confirmação de senha é obrigatória"),
    })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      }
    )
  });

export const updateRoleSchema = z.object({
    body: z.object({
      role: z.string().refine(
        (val) => ["ADMIN", "EDITOR"].includes(val),
        { message: "Role inválida. Use ADMIN ou EDITOR" }
      )
    })
  });