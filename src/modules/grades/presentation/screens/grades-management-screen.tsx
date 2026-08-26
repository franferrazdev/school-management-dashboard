"use client";

import { GradeForm } from "../components/grade-form";
import { useGradesStore } from "../store/grades-store";

export function GradesManagementScreen() {
  const { selectedPeriod, resetFilters } = useGradesStore();

  return (
    <main className="min-h-screen bg-stone-950 p-8 text-stone-100 flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-s-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-100">
            Painel de Monitoramento de Rendimento (ENEM)
          </h1>
          <p className="text-sm text-stone-400">
            Escola de Elite - Gestão estrita de notas, simulados estruturados e
            metas vestibulares.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-rose-950/50 text-rose-400 border border-rose-900 px-3 py-1 rounded-full text-xs font-semibold">
            Visualizando: {selectedPeriod.replace("_", " ")}
          </span>
          <button
            onClick={resetFilters}
            className="text-xs bg-stone-900 hover:bg-stone-800 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-300 transition-colors cursor-pointer"
          >
            Limpar Filtros UI
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <GradeForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-stone-900 border border-stone-800 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-200">
                Projeção Estatística de Desempenho Escolar
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Mapeamento analítico de evolução de simulados e métricas de
                corte.
              </p>

              <div className="border border-dashed border-stone-800 rounded-lg p-12 text-center text-stone-500 text-sm flex flex-col items-center justify-center gap-2">
                <p>
                  O ecossistema gráfico do Recharts / Shadcn será renderizado
                  neste bloco.
                </p>
                <p className="text-xs text-stone-600 max-w-sm">
                  Exibirá o progresso temporal das médias bimestrais em
                  comparação direta com o índice de corte de alta performance
                  (70.0 pontos).
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-400 justify-between items-center">
            <span>
              Status da Trava de Concessões: Ativa (Max. 10 Bolsas Anuais)
            </span>
            <span className="text-emerald-400  font-medium">
              Banco de Dados Pareado
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
