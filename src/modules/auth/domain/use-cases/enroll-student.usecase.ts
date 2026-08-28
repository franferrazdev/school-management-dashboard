import { z } from "zod";
import { prisma } from "@/infra/database/prisma-client";
import { hashPassword } from "@/infra/crypto/bcrypt-hasher";
import { ScholarshipLimitExceededError } from "../errors/scholarship-limit-exceeded.error";

// Esquema rígido do Zod v4 para garantir consistência antes da execução
export const EnrollStudentSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "O nome do estudante deve ter pelo menos 3 caracteres.",
    }),
  email: z.email({ message: "O formato do e-mail constitucional é invalido." }),
  password: z
    .string()
    .min(8, {
      message: "A senha de acesso deve possuir no mínimo 8 caracteres.",
    }),
  isScholarship: z.boolean(),
  isScholarshipPercentage: z.number().min(0).max(100),
  yearOfAdmission: z.number().min(2020).max(2030),
});

export type EnrollStudentInput = z.infer<typeof EnrollStudentSchema>;

export class EnrollStudentUseCase {
  async execute(input: EnrollStudentInput) {
    // Validação estrutural com o Zod v4 core
    const data = EnrollStudentSchema.parse(input);

    // Ajuste automático de consistência de estado
    const percent = data.isScholarship ? data.isScholarshipPercentage : 0;

    // TRAVA DE COVERNANÇA: Se for bolsista, valida o limite anual da instituição
    if (data.isScholarship) {
      const activeScholarshipsCout = await prisma.studentProfile.count({
        where: {
          isScholarship: true,
          yearOfAdmission: data.yearOfAdmission,
          status: "ACTIVE",
        },
      });

      // Se o contador atingir o limite estrito de 10, aborta na hora lançando a exceção
      if (activeScholarshipsCout >= 10) {
        throw new ScholarshipLimitExceededError(data.yearOfAdmission);
      }
    }

    // Criação segura e criptografada utilizando transação atômica do Prisma
    const passwordHash = await hashPassword(data.password);

    return await prisma.$transaction(async (tx) => {
      // Cria a credencial de acesso na tabela users
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: "STUDENT",
        },
      });

      // Vincula o perfil acadêmico e financeiro do estudante utilizando o ID gerado
      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          isScholarship: data.isScholarship,
          isScholarshipPercentage: percent,
          yearOfAdmission: data.yearOfAdmission,
          status: "ACTIVE",
        },
      });

      return { userId: user.id, profileId: profile.id };
    });
  }
}
