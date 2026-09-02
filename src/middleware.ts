import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    try {
      // Pula middleware durante builds estáticos
      if (!req.url) {
        return NextResponse.next();
      }

      // Captura o token de sessão descriptografado do usuário logado
      const token = req.nextauth.token;
      const path = req.nextUrl.pathname;

      // Protege rotas administrativas contra estudantes
      if (path.startsWith("/admin") && token?.role !== "COORDINATOR") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Permite o acesso padrão
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      // Em caso de erro, permite o acesso para evitar crashes
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      // O middleware só será executado se a função authorized retornar true
      // Retornar !!token garante que o usuário precisa estar obrigatoriamente logado
      authorized: ({ token }) => {
        try {
          return !!token;
        } catch (error) {
          console.error("Authorization callback error:", error);
          return false;
        }
      },
    },
    pages: {
      signIn: "/login", // Redireciona para a tela customizada se for barrado
    },
  },
);

// Define quais rotas o Next.js deve interceptar e aplicar a tranca de segurança.
// As API routes ficam fora do middleware para não redirecionar o fetch do front-end
// para /login, o que quebraria o JSON esperado pelo client.
export const config = {
  matcher: ["/((?!api|login|_next/static|_next/image|favicon.ico).*)"],
};
