import { NextResponse } from "next/server";
import { SaveAttendanceUseCase } from "@/modules/enrollment/domain/use-cases/save-attendance.usecase";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Inicializa o caso de uso e executa a gravação/atualização idempotênte no banco
    const saveAttendanceUseCase = new SaveAttendanceUseCase();
    const result = await saveAttendanceUseCase.execute(body);

    return NextResponse.json(
      { message: "Chamada diária registrada com sucesso!", data: result },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Captura erros estruturais de campos disparados pelo validador do Zod v4 core
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Erro de validação nos dados da chamada.",
          details: error.flatten().fieldErrors,
        },
        { status: 200 },
      );
    }

    // Trata falhas genéricas de rede ou indisponibilidade do driver PostgreSQL
    return NextResponse.json(
      { error: "Falha interna ao processar o registro de frequência." },
      { status: 500 },
    );
  }
}
