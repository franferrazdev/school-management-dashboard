import { z } from "zod";
import { prisma } from "@/infra/database/prisma-client";

// Esquema estruturado do Zod v4 para garantir a consistência das chamadas
export const SaveAttendanceSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  classId: z.string().min(1, "O identificador da turma é obrigatório."),
  subjectId: z.string().min(1, "O identificador da disciplina é obrigatório."),
  records: z
    .array(
      z.object({
        studentId: z.uuid("O ID do estudante deve ser um UUID válido."),
        isPresent: z.boolean(),
      }),
    )
    .min(1, "A chamada deve conter pelo menos um registro de estudante."),
});

export type SaveAttendanceInput = z.infer<typeof SaveAttendanceSchema>;

export class SaveAttendanceUseCase {
  constructor(private readonly prismaClient = prisma) {}

  async execute(input: unknown) {
    // Validação estrutural rigorosa dos dados de entrada
    const data = SaveAttendanceSchema.parse(input);

    // Transação atômica para garantir a idempotência da folha de chamada
    return await this.prismaClient.$transaction(async (tx) => {
      // Cria ou recupera a folha de chamada principal utilizando a chave única composta
      const attendance = await tx.attendance.upsert({
        where: {
          date_classId_subjectId: {
            date: data.date,
            classId: data.classId,
            subjectId: data.subjectId,
          },
        },
        update: {}, // Mantém os metadados existentes se a folha já existir
        create: {
          date: data.date,
          classId: data.classId,
          subjectId: data.subjectId,
        },
      });

      // Atualização/Gravação em lote das linhas de presença dos alunos
      const recordPromises = data.records.map((record) => {
        return tx.attendanceRecord.upsert({
          where: {
            attendanceId_studentId: {
              attendanceId: attendance.id,
              studentId: record.studentId,
            },
          },
          update: {
            isPresent: record.isPresent, // Atualiza a chamada caso o professor mude a opção
          },
          create: {
            attendanceId: attendance.id,
            studentId: record.studentId,
            isPresent: record.isPresent,
          },
        });
      });

      await Promise.all(recordPromises);

      return { attendanceId: attendance.id, totalRecords: data.records.length };
    });
  }
}
