"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateGradeDTO,
  CreateGradeDTOSchema,
} from "../../data/dtos/grade.dto";
import { usePostGrade } from "../hooks/use-post-grade";

export function GradeForm() {
  const { mutate: postGrade, isPending } = usePostGrade();

  // Inicializa o gerenciador de formulários acoplando a validação estrita do Zod v4
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGradeDTO>({
    resolver: zodResolver(CreateGradeDTOSchema),
    defaultValues: {
      value: 0,
      type: "REGULAR_EXAM",
      period: "BIMESTRE_1",
    },
  });

  const onSubmit = (data: CreateGradeDTO) => {
    postGrade(data, {
      onSuccess: () => {
        alert("Nota lançada com sucesso no sistema!");
        reset();
      },
      onError: (error) => {
        alert(`Erro ao lançar nota: ${error.message}`);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 bg-stone-900 border-stone-800 rounded-xl shadow-lg max-w-md w-full text-stone-100"
    >
      <h2 className="text-xl font-bold border border-stone-800 pb-2 text-rose-400">
        Lançamento de Avaliação
      </h2>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-stone-300">
          Nota da Avaliação (0.0 a 100.0)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("value", { valueAsNumber: true })}
          className="p-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-rose-500"
          placeholder="Ex.: 85.50"
        />
        {errors.value && (
          <p className="text-xs text-red-400 font-medium">
            {errors.value.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-stone-300">
          Tipo de Avaliação
        </label>
        <select
          {...register("type")}
          className="p-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-rose-500"
        >
          <option value="REGULAR_EXAM">Prova Corrente Regular</option>
          <option value="SIMULATED_ENEM">Simulado Modelo Enem (Rígido)</option>
          <option value="PROJECT">Projeto de Extensão/Pesquisa</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-stone-300">
          Período Letivo
        </label>
        <select
          {...register("type")}
          className="p-2 bg-stone-950 border border-s-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-rose-500"
        >
          <option value="BIMESTRE_1">1º Bimestre</option>
          <option value="BIMESTRE_2">2º Bimestre</option>
          <option value="BIMESTRE_3">3º Bimestre</option>
          <option value="BIMESTRE_4">4º Bimestre</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-s-stone-800">
        <input
          type="text"
          {...register("studentId")}
          placeholder="UUID do Aluno"
          className="p-1.5 bg-stone-950 border border-s-stone-800 rounded text-xs text-stone-400 focus:outline-none"
        />
        {errors.studentId && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}

        <input
          type="text"
          {...register("teacherId")}
          placeholder="UUID do Professor"
          className="p-1.5 bg-stone-950 border border-s-stone-800 rounded text-xs text-stone-400 focus:outline-none"
        />
        {errors.teacherId && (
          <p className="text-xs text-red-400">{errors.teacherId.message}</p>
        )}

        <input
          type="text"
          {...register("classId")}
          placeholder="UUID da Turma"
          className="p-1.5 bg-stone-950 border border-s-stone-800 rounded text-xs text-stone-400 focus:outline-none"
        />
        {errors.classId && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-4 p-2.5 bg-rose-700 hover:bg-rose-800 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
      >
        {isPending
          ? "Processando Lançamento..."
          : "Submeter Nota para o Boletim"}
      </button>
    </form>
  );
}
