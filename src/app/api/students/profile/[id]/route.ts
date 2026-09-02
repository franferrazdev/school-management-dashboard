import { NextResponse } from "next/server";
import { prisma } from "@/infra/database/prisma-client";

export const dynamic = "force-dynamic";

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

    const [mentorTeacher, activeClass] = await Promise.all([
      prisma.user.findFirst({
        where: { role: "TEACHER" },
        select: { id: true, name: true },
      }),
      prisma.class.findFirst({
        where: { isActive: true },
        orderBy: { year: "desc" },
        select: { id: true, name: true, year: true },
      }),
    ]);

    // Estrutura com os vínculos reais disponíveis no banco para auditoria
    const completeProfileSheet = {
      studentProfileUuid: profile.id,
      userUuid: profile.user.id,
      name: profile.user.name,
      email: profile.user.email,
      yearOfAdmission: profile.yearOfAdmission,
      status: profile.status,
      isScholarship: profile.isScholarship,
      isScholarshipPercentage: profile.isScholarshipPercentage,
      classUuid: activeClass?.id ?? null,
      classCode: activeClass
        ? `${activeClass.name} (${activeClass.year})`
        : null,
      className: activeClass?.name ?? null,
      mentorTeacherUuid: mentorTeacher?.id ?? null,
      mentorTeacherName: mentorTeacher?.name ?? null,
    };

    return NextResponse.json(completeProfileSheet, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao processar os metadados da ficha." },
      { status: 500 },
    );
  }
}
