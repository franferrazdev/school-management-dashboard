"use client"

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {GradesManagementScreen} from '@/modules/grades/presentation/screens/grades-management-screen'


// Cria o cliente do TanStack Query para gerenciar o cache local nos testes visuais
const queryClient = new QueryClient()

export default function Home(){
  return(
    <QueryClientProvider client={queryClient}>
<GradesManagementScreen />
    </QueryClientProvider>
  )
}