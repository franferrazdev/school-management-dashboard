"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentProfileSheet } from "./student-profile-sheet";

const AttendanceFormSchema = z.object({
  date: z.string().min(1, "A data da chamada é obrigatória."),
  classId: z.string().min(1, "A seleção da turma é obrigatória."),
  subjectId: z.string().min(1, "A seleção da disciplina é obrigatória."),
  records: z.array(
    z.object({
      studentId: z.uuid(),
      isPresent: z.boolean(),
    }),
  ),
});

type AttendanceFormInput = z.infer<typeof AttendanceFormSchema>;

interface Student {
  id: string;
  name: string;
  totalClasses: number;
  absences: number;
}

export function AttendanceRollCall() {
  const [students, setStudents] = useState<Student[]>([]); // Estado para armazenar os alunos reais do banco
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const { register, handleSubmit, setValue } = useForm<AttendanceFormInput>({
    resolver: zodResolver(AttendanceFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      classId: "TURMA-A-2026",
      subjectId: "MATEMATICA-ENEM",
      records: [],
    },
  });

  // BUSCA AUTOMÁTICA EM NUVEM: Carrega os alunos matriculados direto do Supabase
  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students/list", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Falha ao buscar estudantes.");
        const data = await response.json();

        setStudents(data);

        // Limpeza de estado
        setApiError(null);

        // Preenche o formulário do React Hook com os IDs dos alunos reais
        setValue(
          "records",
          data.map((s: Student) => ({ studentId: s.id, isPresent: true })),
        );
      } catch {
        setApiError("Não foi possível carregar a lista de estudantes reais.");
      }
    }
    loadStudents();
  }, [setValue]);

  const onSubmit = async (data: AttendanceFormInput) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/attendance/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const result = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : { error: "Erro interno do servidor." };

      if (!response.ok) {
        throw new Error(result.error || "Falha ao registrar a chamada.");
      }

      setSuccessMessage(result.message || "Chamada registrada com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Ocorreu um erro inesperado ao salvar a frequência.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-xl space-y-6">
      <header className="border-b border-stone-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-stone-100">
            Lançamento de Frequência Diária
          </h2>
          <p className="text-xs text-stone-400">
            Diário de classe digital integrado e cálculo de infrequência
            automatizado.
          </p>
        </div>
      </header>

      {apiError && (
        <div className="p-3 bg-red-950/40 border border-red-900 roudned-lg text-red-400 text-xs font-medium text-center">
          {apiError}
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-lg text-emerald-400 text-xs font-medium text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Metadatos da Chamada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-950 p-4 border border-stone-800 rounded-lg">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-400 uppercase">
              Data da Aula
            </label>
            <input
              type="date"
              {...register("date")}
              className="p-2 bg-stone-900 border border-stone-800 rounded text-sm text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-400 uppercase">
              Turma Alvo
            </label>
            <select
              {...register("classId")}
              className="p-2 bg-stone-900 border border-stone-800 rounded text-sm text-stone-200 focus:outline-none focus:border-rose-500"
            >
              <option value="TURMA-A-2026">
                3º Ano - Alvo: Medicina (Turma A)
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-400 uppercase">
              Componente Curricular
            </label>
            <select
              {...register("subjectId")}
              className="p-2 bg-stone-900 border border-stone-800 rounded text-sm text-stone-200 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <optgroup label="Linguagens e suas Tecnologias">
                <option value="Língua Portuguesa e Literatura">
                  Língua Portuguesa e Literatura
                </option>
                <option value="Língua Inglesa Aplicada">
                  Língua Inglesa Aplicada
                </option>
                <option value="Artes e Cultura Visual">
                  Artes e Cultura Visual
                </option>
                <option value="Educação Física e Saúde">
                  Educação Física e Saúde
                </option>
              </optgroup>

              <optgroup label="Matemática e suas Tecnologias">
                <option value="Matemática Avançada e Tecnologias">
                  Matemática Avançada e Tecnologias
                </option>
                <option value="Biologia Celular e Genética">
                  Biologia Celular e Genética
                </option>
                <option value="Física Mecânica e Termodinâmica">
                  Física Mecânica e Termodinâmica
                </option>
                <option value="Química Orgânica e Laboratório">
                  Química Orgânica e Laboratório
                </option>
              </optgroup>

              <optgroup label="Ciências Humanas e Sociais">
                <option value="História Geral e do Brasil">
                  História Geral e do Brasil
                </option>
                <option value="Geografia e Geopolítica Global">
                  Geografia e Geopolítica Global
                </option>
                <option value="Sociologia Contemporânea">
                  Sociologia Contemporânea
                </option>
                <option value="Filosofia e Ética Cidadã">
                  Filosofia e Ética Cidadã
                </option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Listagem de Alunos */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
            Listagem de Estudantes
          </label>

          {students.length === 0 && !apiError && (
            <p className="text-xs text-stone-500 italic p-4 text-center">
              Buscando lista de matriculados no Supabase...
            </p>
          )}

          {students.map((student, index) => {
            const attendanceRate =
              ((student.totalClasses - student.absences) /
                student.totalClasses) *
              100;
            const isAtRisk = attendanceRate < 75;

            return (
              <div
                key={student.id}
                className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${
                  isAtRisk
                    ? "bg-rose-950/20 border-rose-900/60 shadow-md shadow-rose-950/5"
                    : "bg-stone-950 border-stone-800"
                }`}
              >
                <div>
                  <h4
                    onClick={() => setSelectedStudentId(student.id)}
                    className="text-sm font-bold text-stone-200 hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    {student.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                    <span>
                      Frequência:
                      <strong
                        className={
                          isAtRisk ? "text-rose-400" : "text-emerald-400"
                        }
                      >
                        {attendanceRate.toFixed(1)}%
                      </strong>
                    </span>
                    <span className="text-2xl">·</span>
                    <span>Faltas: {student.absences}</span>
                    {isAtRisk && (
                      <>
                        <span className="text-2xl">·</span>
                        <span className="text-rose-400 font-bold uppercase text-[10px] tracking-wider bg-rose-950/60 px-2 py-0.5 border border-rose-900 rounded">
                          Risco de Reprovação
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="hidden"
                    value={student.id}
                    {...register(`records.${index}.studentId` as const)}
                  />
                  <label className="text-xs font-semibold text-stone-400 uppercase mr-1">
                    Presente
                  </label>
                  <input
                    type="checkbox"
                    {...register(`records.${index}.isPresent` as const)}
                    className="w-5 h-5 accent-rose-700 cursor-pointer rounded bg-stone-900 border-stone-800"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-rose-700 hover:bg-rose-800 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold rounded-lg transition-colors text-sm cursor-pointer shadow-lg"
        >
          {isLoading
            ? "Salvando Folha de Chamada..."
            : "Registrar Chamada Pedagógica"}
        </button>
      </form>

      {selectedStudentId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <StudentProfileSheet
            studentId={selectedStudentId}
            onClose={() => setSelectedStudentId(null)}
          />
        </div>
      )}
    </div>
  );
}
