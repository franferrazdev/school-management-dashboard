"use client";

import { Shield, Globe, User, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1A0A0F] border-t border-[#3A1522] mt-auto px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-[#2C101B]">
        {/* Branding Administrativo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-black tracking-wider bg-gradient-to-r from-[#991B1B] to-[#D97706] bg-clip-text text-transparent uppercase">
            <Shield
              size={16}
              className="text-red-600 dark:text-amber-500 shrink-0"
            />
            Escola de Elite
          </div>
          <p className="text-[11px] text-[#A1A1AA] leading-relaxed max-w-60">
            Plataforma de alta performance homologada para gestão escolar
            pedagógica, governança administrativa e inteligência analítica de
            dados (Business Intelligence).
          </p>
        </div>

        {/* Links de Navegabilidade */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-black text-[#71717A] tracking-widest uppercase">
            Navegabilidade
          </span>
          <div className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">
            <span className="hover:text-[#D97706] transition-colors cursor-pointer w-fit">
              Política de Privacidade
            </span>
            <span className="hover:text-[#D97706] transition-colors cursor-pointer w-fit">
              Termos de Serviço
            </span>
            <span className="hover:text-[#D97706] transition-colors cursor-pointer w-fit">
              Ajuda & Suporte
            </span>
          </div>
        </div>

        {/* Conexões de Engenharia */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-black text-[#71717A] tracking-widest uppercase">
            Engineers Connections
          </span>
          <div className="flex items-center gap-4 text-[#71717A] mt-1">
            <a
              href="https://github.com/franferrazdev"
              target="_blank"
              rel="noopener noreferrer"
              title="Acessar Portfólio Global no Github"
              className="hover:text-[#D97706] transition-colors cursor-pointer"
            >
              <Globe size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/francielle-ferraz-de-sousa-franferrazdev"
              target="_blank"
              rel="noopener noreferrer"
              title="Conectar Perfil Profissional no LinkedIn"
              className="hover:text-[#D97706] transition-colors cursor-pointer"
            >
              <User size={16} />
            </a>
            <a
              href="mailto:franferraz.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Disparar Contato Corporativo via E-mail"
              className="hover:text-[#D97706] transition-colors cursor-pointer"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Direitos Autorais e Status do Sistema */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-center pt-6 text-[10px] text-[#71717A] font-medium gap-2">
        <span>
          &copy; {currentYear} Francielle Ferraz &bull; Escola de Elite. Todos
          os direitos reservados.
        </span>
        <span className="flex items-center gap-1 uppercase tracking-wider text-[9px] font-bold text-[#451a2b] select-none">
          BI Analytics Dashboard Active
        </span>
      </div>
    </footer>
  );
}
