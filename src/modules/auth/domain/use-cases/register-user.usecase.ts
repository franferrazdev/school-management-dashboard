import { email, z } from "zod";
import { hashPassword } from "@/infra/crypto/bcrypt-hasher";

// Esquema de validação do cadastro usando as regras do Zod v4
export const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z
    .string()
    .email({ message: "O formato do e-mail fornecido é inválido." }),
  password: z
    .string()
    .min(8, { message: "A senha deve possuir no mínimo 8 caracteres." }),
  role: z.enum(["COORDINATOR", "TEACHER", "STUDENT"]),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export class RegisterUserUseCase {
  async execute(input: RegisterUserInput) {
    // Valida os dados de entrada usando o Zod v4 core
    const validatedData = RegisterUserSchema.parse(input);

    // Transforma a senha comum em um hash seguro e criptografado assíncrono via Bcrypt
    const passwordHash = await hashPassword(validatedData.password);

    // Devolve os dados preparados para a camada de persistência salvar no Prisma
    return {
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      role: validatedData.role,
    };
  }
}
