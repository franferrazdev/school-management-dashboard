import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SaveAttendanceUseCase } from "@/modules/enrollment/domain/use-cases/save-attendance.usecase";
import { ZodError } from "zod";
import { prisma } from "@/infra/database/prisma-client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Você precisa estar autenticado para registrar a frequência.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Inicializa o caso de uso e executa a gravação/atualização idempotênte no banco
    const saveAttendanceUseCase = new SaveAttendanceUseCase(prisma);
    const result = await saveAttendanceUseCase.execute(body);

    return NextResponse.json(
      { message: "Chamada diária registrada com sucesso!", data: result },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("POST /api/attendance/save failed:", error);

    // Captura erros estruturais de campos disparados pelo validador do Zod v4 core
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Erro de validação nos dados da chamada.",
          details: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Falha interna ao processar o registro de frequência.";

    // Trata falhas genéricas de rede ou indisponibilidade do driver PostgreSQL
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
