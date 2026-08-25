import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateGradeDTO } from "../../data/dtos/grade.dto";

async function postGradeRequest(data: CreateGradeDTO): Promise<void> {
  const response = await fetch("/api/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Falha ao registrar nota no servidor escolar.",
    );
  }
}

export function usePostGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postGradeRequest,
    onSuccess: () => {
      // Invalida o cache de notas do TanStack Query para recarregar a tabela automaticamente na tela
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
}
