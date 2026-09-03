"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GradesManagementScreen } from "@/modules/grades/presentation/screens/grades-management-screen";

// Inicializa o cliente de cache estável para o escopo do painel administrativo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <GradesManagementScreen />;
    </QueryClientProvider>
  );
}
