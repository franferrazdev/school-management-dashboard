import { Grade } from "../entities/grade";

export interface IGradesRepository {
  save(grade: Grade): Promise<void>;
  findByStudent(studentId: string): Promise<Grade[]>;
  findByClassAndPeriod(classId: string, period: string): Promise<Grade[]>;
}
