"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema do Zod v4 espelhado no caso de uso do backend
const EnrollFormSchema = z.object({
  name: z.string().min(3, "O nome deve conter pelo menos 3 caracteres."),
  email: z.email("O formato do e-mail institucional é inválido."),
  password: z.string().min(8, "A senha deve possuir no mínimo 8 caracteres."),
  isScholarship: z.boolean(),
  isScholarshipPercentage: z.coerce.number().min(0).max(100),
  yearOfAdmission: z.coerce.number().min(2020).max(2030),
});

type EnrollFormInput = z.input<typeof EnrollFormSchema>;

export function EnrollStudentForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnrollFormInput>({
    resolver: zodResolver(EnrollFormSchema),
    defaultValues: {
      isScholarship: false,
      isScholarshipPercentage: 0,
      yearOfAdmission: new Date().getFullYear(),
    },
  });

  // Monitora o checkbox de bolsa para habilitar/desabilitar o campo de porcentagem
  const isScholarshipChecked = watch("isScholarship");

  const onSubmit = async (data: EnrollFormInput) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/students/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao processar a matrícula.");
      }
      setSuccessMessage(result.message);
      reset();
    } catch (error: unknown) {
      // PROTEÇÃO DE TIPO (Type Guard): Garante que o erro herdou a calsse Error global do JS
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Ocorreu um erro inesperado ao processar os dados.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-xl space-y-6">
      <header className="border-b border-stone-800 pb-3">
        <h2 className="text-xs font-bold text-stone-100">
          Matricular Novo Estudante
        </h2>
        <p className="text-xs text-stone-400">
          Controle estrito de admissão e políticas de isenção de mensalidade.
        </p>
      </header>

      {/* Alerta de Retorno da API do Servidor */}
      {apiError && (
        <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-xs font-medium text-center">
          {apiError}
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-lg text-emerald-400 text-xs font-medium text-center">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 text-stone-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase -tracking-wider">
              Nome Completo
            </label>
            <input
              type="text"
              {...register("name")}
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
              placeholder="Nome do aluno"
            />
            {errors.name && (
              <p className="text-xs text-red-400 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              E-mail Institucional
            </label>
            <input
              type="email"
              {...register("email")}
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
              placeholder="aluno@elite.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Senha Padrão */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Senha de Acesso
            </label>
            <input
              type="password"
              {...register("password")}
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
              placeholder="Defina a senha"
            />
            {errors.password && (
              <p className="text-xs text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Ano de Admissão */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Ano Letivo de Ingresso
            </label>
            <input
              type="number"
              {...register("yearOfAdmission")}
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
            />
            {errors.yearOfAdmission && (
              <p className="text-xs text-red-400 font-medium">
                {errors.yearOfAdmission.message}
              </p>
            )}
          </div>
        </div>

        {/* Bloco de Gestão de Bolsas */}
        <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-stone-200 block">
                Estudante Bolsista
              </label>
              <span className="text-xs text-stone-400">
                Sujeito ao teto limite de 10 concessões ativas por ano letivo.
              </span>
            </div>
            <input
              type="checkbox"
              {...register("isScholarship")}
              className="w-5 h-5 accent-rose-700 cursor-pointer rounded bg-stone-900 border-s-stone-800"
            />
          </div>

          {isScholarshipChecked && (
            <div className="flex flex-col gap-1 pt-2 border-t border-stone-800/60 animate-fadeIn">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Percentual de Isenção (%)
              </label>
              <input
                type="number"
                {...register("isScholarshipPercentage")}
                className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg focus:outline-none focus:border-rose-500 text-sm text-rose-400 font-bold"
                placeholder="Ex.: 50"
              />
              {errors.isScholarshipPercentage && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.isScholarshipPercentage.message}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-rose-700 hover:bg-rose-800 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold rounded-lg transition-colors text-sm cursor-pointer shadow-lg shadow-rose-950/20"
        >
          {isLoading
            ? "Processando Matrícula..."
            : "Efetivar Matrícula Acadêmica"}
        </button>
      </form>
    </div>
  );
}
