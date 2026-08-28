import { withAuth } from "next-auth/middleware";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Captura o token de sessão descriptografado do usuário logado
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protege rotas administrativas contra estudantes
    if (path.startsWith("/admin") && token?.role !== "COORDINATOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // O middleware só será executado se a função authorized retornar true
      // Retornar !!token garante que o usuário precisa estar obrigatoriamente logado
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redireciona para a tela customizada se for barrado
    },
  },
);

// Define quais rotas o Next.js deve interceptar e aplicar a tranca de segurança
export const config = {
  matcher: [
    /* Intercepta a rota principal (/) e todas as sub-rotas privadas, mas ignora os arquivos estáticos (imagens, favicon) e a própria tela de login */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
