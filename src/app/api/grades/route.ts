import { NextResponse } from "next/server";
import { CreateGradeDTOSchema } from "@/modules/grades/data/dtos/grade.dto";
import { PrismaGradesRepository } from "@/modules/grades/data/repositories/prisma-grades-repository";
import { PostGradeUseCase } from "@/modules/grades/domain/use-cases/post-grade.usecase";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // Captura o corpo da requisição HTTP
    const body = await request.json();

    // Valida o payload de entrada usando o esquema do Zod v4 (CreateGradeDTO)
    const validationResult = CreateGradeDTOSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = z.treeifyError(validationResult.error);

      return NextResponse.json(
        {
          message: "Falha na validação dos dados de entrada.",
          errors: formattedErrors, // Devolve a árvore de erros limpa para o Front-End
        },
        { status: 400 },
      );
    }

    // Intanciação Muanual das Camadas da Clean Architecture (Inverão de Dependencia)
    const gradesRepository = new PrismaGradesRepository();
    const postGradeUseCase = new PostGradeUseCase(gradesRepository);

    // Executa o Caso de Uso contendo as regras puras de negócio
    const result = await postGradeUseCase.execute(validationResult.data);

    // Retorna o objeto criado com o status HTTP 21 (Created)
    return NextResponse.json(
      {
        message: "Nota registrada com sucesso no sistema de alta performance.",
        data: {
          id: result.id,
          value: result.value,
          type: result.type,
          period: result.period,
          studentId: result.studentId,
          teacherId: result.teacherId,
          classId: result.classId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    // Verifica se o erro capturado herda da classe global Error
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro interno desconhecido ao processar lançamento de nota.";

    // Tratamento isolado para falhas de regras de negócio (ex.: período letivo fechado)
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
