import { z } from "zod";
import {
  GradeTypeSchema,
  AcademicPreriodSchema,
} from "../../domain/entities/grade";

export const CreateGradeDTOSchema = z.object({
  value: z
    .number({
      message: "A nota é obrigatória e deve ser um valor numérico decimal.",
    })
    .min(0, { message: "A nota mínima permitida é 0.0." })
    .max(100, { message: "A nota não pode ser superior a 100.0." }),

  type: GradeTypeSchema,
  period: AcademicPreriodSchema,
  studentId: z.uuid({ message: "O ID do aluno fornecido é inválido." }),
  teacherId: z.uuid({ message: "O ID do professor fornecido é inválido." }),
  classId: z.uuid({ message: "O ID da turma fornecido é inválido." }),
});

export type CreateGradeDTO = z.infer<typeof CreateGradeDTOSchema>;
