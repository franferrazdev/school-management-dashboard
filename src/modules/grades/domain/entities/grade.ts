import { z } from "zod";

// Definição dos Enums de controle estrito em conformidade com o Prisma
export const GradeTypeSchema = z.enum([
  "REGULAR_EXAM",
  "SIMULATED_ENEM",
  "PROJECT",
]);
export const AcademicPreriodSchema = z.enum([
  "BIMESTRE_1",
  "BIMESTRE_2",
  "BIMESTRE_3",
  "BIMESTRE_4",
]);

export type GradeSchema = z.infer<typeof GradeSchema>;
export type AcademicPeriod = z.infer<typeof AcademicPreriodSchema>;

// Esquema de Validação adaptado para as regras modernas do Zod v4
export const GradeSchema = z.object({
  id: z.uuid().optional(),

  // Sintaxe de erro unificada do Zod v4
  value: z
    .number({
      message: "O valor da nota é obrigatório e deve ser um número decimal.",
    })
    .min(0, { message: "A nota mínima permitida no sistema é 0.0." })
    .max(100, { message: "A nota máxima permitida no sistema é 100.0" }),

  type: GradeTypeSchema,
  period: AcademicPreriodSchema,

  // Uso das funções globais z.uuid()
  studentId: z.uuid({ message: "ID do aluno inválido." }),
  teacherId: z.uuid({ message: "ID do professor inválido." }),
  classId: z.uuid({ message: "ID da turma inválido." }),

  createdAT: z.date().optional(),
});

export type GradeProperties = z.infer<typeof GradeSchema>;

// Classe de Entidade Pura do Domínio (Regras de Negócio Isoladas)
export class Grade {
  private props: GradeProperties;

  constructor(props: GradeProperties) {
    // Dispara a validação do Zod imediatamente ao instanciar a entidade
    this.props = GradeSchema.parse(props);
  }

  // Getters para expor os dados com total segurança para as camadas externas
  get id() {
    return this.props.id;
  }
  get value() {
    return this.props.value;
  }
  get type() {
    return this.props.type;
  }
  get period() {
    return this.props.period;
  }
  get studentId() {
    return this.props.studentId;
  }
  get teacherId() {
    return this.props.teacherId;
  }
  get classId() {
    return this.props.classId;
  }
  get createdAt() {
    return this.props.createdAT;
  }

  // Regra da Escola: Alerta automático para notas abaixo de 70.0
  public isBelowHighPerformance(): boolean {
    return this.props.value < 70.0;
  }
}
