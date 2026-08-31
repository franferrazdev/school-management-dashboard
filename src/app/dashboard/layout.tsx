"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Desempenho Acadêmico", href: "/dashboard" },
    { name: "Matricular Aluno", href: "/dashboard/enrollment" },
    { name: "Chamada Diária", href: "/dashboard/attendance" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-950 text-stone-100">
      {/* Barra Lateral de Navegação (Sidebar) */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          <header className="border-b border-stone-800 pb-4">
            <h1 className="text-lg font-black text-rose-500 uppercase tracking-widest">
              Elite Dashboard
            </h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
              Sessão Administrativa
            </p>
          </header>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-rose-950/60 border border-rose-900 text-rose-400 shadow-md"
                      : "text-stone-400 hover:bg-stone-850 hover:text-stone-200"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <footer className="border-t border-stone-800 pt-4 flex flex-col gap-1">
          <span className="text-xs text-stone-400 font-medium block">
            Coordenação Elite
          </span>
          <span className="text-[10px] text-stone-500 block">
            Ambiente Conectado
          </span>
        </footer>
      </aside>

      {/* Área de Conteúdo Principal Dedicada às Tela */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
