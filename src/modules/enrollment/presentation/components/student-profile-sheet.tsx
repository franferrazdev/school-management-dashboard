"use client";

import { useEffect, useState } from "react";

interface ProfileSheet {
  studentProfileUuid: string;
  userUuid: string;
  name: string;
  email: string;
  yearOfAdmission: number;
  status: string;
  isScholarship: boolean;
  isScholarshipPercentage: number;
  classUuid: string | null;
  classCode: string | null;
  className: string | null;
  mentorTeacherUuid: string | null;
  mentorTeacherName: string | null;
}

interface StudentProfileSheetProps {
  studentId: string;
  onClose: () => void;
}

export function StudentProfileSheet({
  studentId,
  onClose,
}: StudentProfileSheetProps) {
  const [data, setData] = useState<ProfileSheet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSheet() {
      try {
        const response = await fetch(`/api/students/profile/${studentId}`);
        if (!response.ok) throw new Error("Erro ao carregar os metadados.");
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      }
    }
    if (studentId) fetchSheet();
  }, [studentId]);

  if (error)
    return (
      <div className="p-4 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-xs text-center">
        {error}
      </div>
    );
  if (!data)
    return (
      <p className="text-xs text-stone-400 italic text-center animate-pulse">
        Buscando tokens de auditoria...
      </p>
    );

  return (
    <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-6 space-y-6 text-stone-100 animate-fadeIn">
      <header className="border-b border-stone-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-stone-100">Ficha Cadastral</h3>
          <p className="text-xs text-stone-400">
            Tokens identificadores (UUID) e vínculos pedagógicos institucionais.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 px-3 bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          Fechar Ficha
        </button>
      </header>

      <div className="space-y-4">
        {/* Seção 1: Dados Gerais do Aluno */}
        <section className="bg-stone-950 p-4 border border-stone-800 rounded-xl space-y-2">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">
            01. Indentificação Estudantil
          </h4>
          <p className="text-sm font-bold">{data.name}</p>
          <p className="text-xs text-stone-400">{data.email}</p>
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-stone-900 mt-2">
            <span>
              Ano de Admissão:{" "}
              <strong className="text-stone-300">{data.yearOfAdmission}</strong>
            </span>
            <span>
              Regime{" "}
              <strong
                className={
                  data.isScholarship ? "text-rose-400" : "text-stone-400"
                }
              >
                {data.isScholarship
                  ? `Bolsista (${data.isScholarshipPercentage}%)`
                  : "Regular"}
              </strong>
            </span>
          </div>
        </section>

        {/*Seção 2:  Exibição Estruturada de UUIDs de Sistema */}
        <section className="bg-stone-950 p-4 border border-stone-800 rounded-xl space-y-3 font-mono">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest block font-sans">
            02. Registro de Tokens e Auditoria (UUID)
          </h4>

          <div className="space-y-1">
            <span className="text-[10-px] text-stone-500 uppercase tracking-wider block font-sans">
              UUID do Estudante
            </span>
            <span className="text-xs text-rose-400 bg-rose-950/20 p-2.5 border border-r-rose-900/40 rounded block break-all select-all">
              {data.studentProfileUuid}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
              UUID da Conta do Usuário
            </span>
            <span className="text-xs text-stone-400 bg-stone-900 p-2.5 border border-rose-800 rounded block break-all select-all">
              {data.userUuid}
            </span>
          </div>
        </section>

        {/* Seção 3: Alocação e Mentores */}
        <section className="bg-stone-950 p-4 border border-stone-800 rounded-xl space-y-3">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">
            03. Vínculos de Alocação e Orientação
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                Turma Designada
              </span>
              <p className="text-xs font-bold text-stone-200">
                {data.className
                  ? `${data.className} (${data.classCode})`
                  : "Nenhuma turma ativa cadastrada"}
              </p>
              <span className="text-[9px] text-stone-500 font-mono block break-all bg-stone-900 p-1.5 rounded">
                {data.classUuid ?? "UUID indisponível"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                Professor Mentor Geral
              </span>
              <p className="text-xs font-bold text-stone-200">
                {data.mentorTeacherName ?? "Nenhum professor cadastrado"}
              </p>
              <span className="text-[9px] text-stone-500 font-mono block break-all bg-stone-900 p-1.5 rounded">
                {data.mentorTeacherUuid ?? "UUID indisponível"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
