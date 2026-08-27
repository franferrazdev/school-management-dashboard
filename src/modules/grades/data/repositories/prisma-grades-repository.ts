import { prisma } from "@/infra/database/prisma-client";
import { Grade } from "../../domain/entities/grade";
import { IGradesRepository } from "../../domain/repositories/grades-repository.interface";
import { AcademicPeriod, GradeType, Prisma } from "@generated/prisma/client";

export class PrismaGradesRepository implements IGradesRepository {
  async save(grade: Grade): Promise<void> {
    // Transform a Entidade pura de domínio no formato físico esperado pelas tabelas do Prisma 7
    await prisma.grade.create({
      data: {
        id: grade.id,
        value: new Prisma.Decimal(grade.value),
        type: grade.type as GradeType,
        period: grade.period as AcademicPeriod,
        studentId: grade.studentId,
        teacherId: grade.teacherId,
        classId: grade.classId,
        createdAt: grade.createdAt,
      },
    });
  }

  async findByStudent(studentId: string): Promise<Grade[]> {
    const records = await prisma.grade.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    // Mapeia os registros crus do banco relacional de volta para instâncias ricas da Entidade
    return records.map(
      (record) =>
        new Grade({
          id: record.id,
          value: record.value.toNumber(),
          type: record.type,
          period: record.period,
          studentId: record.studentId,
          teacherId: record.teacherId,
          classId: record.classId,
          createdAT: record.createdAt,
        }),
    );
  }

  async findByClassAndPeriod(
    classId: string,
    period: string,
  ): Promise<Grade[]> {
    const records = await prisma.grade.findMany({
      where: {
        classId,
        period: period as AcademicPeriod,
      },
    });

    return records.map(
      (record) =>
        new Grade({
          id: record.id,
          value: record.value.toNumber(),
          type: record.type,
          period: record.period,
          studentId: record.studentId,
          teacherId: record.teacherId,
          classId: record.classId,
          createdAT: record.createdAt,
        }),
    );
  }
}
