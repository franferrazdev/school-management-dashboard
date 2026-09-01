import { z } from "zod";
import { prisma } from "@/infra/database/prisma-client";

// Esquema estruturado do Zod v4 para garantir a consistência das chamadas
export const SaveAttendanceSchema = z.object({
  date: z.string().min(1, "A data da chamada é obrigatória."),
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

function parseAttendanceDate(rawDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate.trim());

  if (!match) {
    throw new Error("A data da chamada deve estar no formato YYYY-MM-DD.");
  }

  const [, year, month, day] = match;
  const parsed = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("A data da chamada informada é inválida.");
  }

  return parsed;
}

export class SaveAttendanceUseCase {
  constructor(private readonly prismaClient = prisma) {}

  async execute(input: unknown) {
    // Validação estrutural rigorosa dos dados de entrada
    const data = SaveAttendanceSchema.parse(input);

    const targetDate = parseAttendanceDate(data.date);

    // Transação atômica para garantir a idempotência da folha de chamada
    return await this.prismaClient.$transaction(async (tx) => {
      // BUSCA EXPLÍCITA: Localiza a folha de chamada
      let attendance = await tx.attendance.findFirst({
        where: {
          date: targetDate,
          classId: data.classId,
          subjectId: data.subjectId,
        },
      });

      // CRIAÇÃO CONDICIONAL: Se não existir no Supabase, insere o registro do zero
      if (!attendance) {
        attendance = await tx.attendance.create({
          data: {
            date: targetDate,
            classId: data.classId,
            subjectId: data.subjectId,
          },
        });
      }

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
