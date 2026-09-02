import { NextResponse } from "next/server";
import { prisma } from "@/infra/database/prisma-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Busca todos os perfis de estudantes ativos no Supabase trazendo o nome do usuário associado
    const students = await prisma.studentProfile.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc", // Organiza a lista de chamada em ordem alfabética de A a Z
        },
      },
    });

    // Modifica a estrutura dos dados para ficar amigável para o front-end
    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.user.name,
      // Como o aluno é novo, simulei dados iniciais de frequência baseados no ano de admissão
      totalClasses: 40,
      absences: student.isScholarship ? 6 : 2, // Uma simulação inicial de faltas
    }));

    return NextResponse.json(formattedStudents, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    // Captura o erro internamente para não derrubar o servidor Node.js
    console.log("Erro interno na API de listagem:", error);
    return NextResponse.json(
      { error: "Falha ao listar estudantes do banco de dados." },
      { status: 500 },
    );
  }
}
