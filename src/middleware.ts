import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Captura o token de sessão descriptografado do usuário logado
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // Se o usuário tentar acessar rotas protegidas sem estar logado, redireciona para o login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Tranca de segurança administrativa: Apenas COORDINATOR acessa rotas de admin
    if (path.startsWith("/admin") && token?.role !== "COORDINATOR") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Permite o acesso padrão
    return NextResponse.next();
  },
  {
    callbacks: {
      // O middleware só roda se o token existir
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redireciona para a tela de login customizada se for barrado
    },
  },
);

// Define as rotas específicas que exigem login obrigatório, mantendo a API e estáticos livres
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/adimin/:path*",
    "/api/attendance/:path*",
    "/api/students/:path*",
  ],
};
