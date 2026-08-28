import { NextResponse } from "next/server";
import { EnrollStudentUseCase } from "@/modules/auth/domain/use-cases/enroll-student.usecase";
import { ScholarshipLimitExceededError } from "@/modules/auth/domain/errors/scholarship-limit-exceeded.error";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Inicializa o caso de uso estruturado e executa as trancas de governança
    const enrollUseCase = new EnrollStudentUseCase();
    const result = await enrollUseCase.execute(body);

    return NextResponse.json(
      { message: "Estudante matriculado com sucesso!", data: result },
      { status: 201 },
    );
  } catch (error) {
    // Captura o estouro da trava institucional das 10 bolsas anuais
    if (error instanceof ScholarshipLimitExceededError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Captura erros estruturais de campos vindos do Zod v4 core
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Erro de validação dos dados fornecidos.",
          details: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Trata falhas genéricas de rede ou banco de dados
    return NextResponse.json(
      { error: "Falha interna ao processar a matrícula do estudante." },
      { status: 500 },
    );
  }
}
