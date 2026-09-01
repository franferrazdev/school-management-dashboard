import { NextResponse } from "next/server";
import { prisma } from "@/infra/database/prisma-client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const studentId = params.id;

    // Realiza a busca no banco trazendo o víncolo de dados do usuário
    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Ficha cadastral não localizada." },
        { status: 404 },
      );
    }

    // Estrutura injetando metadados corporativos e hashes UUID de auditoria
    const completeProfileSheet = {
      studentProfileUuid: profile.id,
      userUuid: profile.user.id,
      name: profile.user.name,
      email: profile.user.email,
      yearOfAdmission: profile.yearOfAdmission,
      status: profile.status,
      isScholarship: profile.isScholarship,
      isScholarshipPercentage: profile.isScholarshipPercentage,
      // UUIDs e dados intitucionais simulados de vínculo de turmas e mentores
      classUuid: "c183a214-48bd-4d6d-8bde-77610023fa8c",
      classcode: "TURMA-A-2026",
      className: "3º Ano - Alvo: Medicina (Integral)",
      mentorTeacherUuid: "t719b532-31fa-421c-a110-8849b29cbdf2",
      mentorTeacherName: "Prof. Dr. Ricardo Alburquerque",
    };

    return NextResponse.json(completeProfileSheet, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao processar os metadados da ficha." },
      { status: 500 },
    );
  }
}
