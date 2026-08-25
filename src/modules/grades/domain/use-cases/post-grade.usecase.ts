import { Grade, GradeProperties } from "../entities/grade";
import { IGradesRepository } from "../repositories/grades-repository.interface";

export interface PostGradeInput extends GradeProperties {}

export class PostGradeUseCase {
  constructor(private gradesRepository: IGradesRepository) {}

  async execute(input: PostGradeInput): Promise<Grade> {
    const grade = new Grade(input);
    const isAcademicPeriodClosed = false;

    if (isAcademicPeriodClosed) {
      throw new Error(
        "Operação negada; O período letivo correspondente já está encerrada pela Coordenação.",
      );
    }

    await this.gradesRepository.save(grade);
    return grade;
  }
}
