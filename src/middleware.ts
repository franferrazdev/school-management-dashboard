import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    try {
      // Pula middleware durante builds estáticos ou se não houver URL
      if (!req.url || !req.nextUrl) {
        return NextResponse.next();
      }

      // Captura o token de sessão descriptografado do usuário logado
      const token = req.nextauth?.token;
      const path = req.nextUrl.pathname;

      // Protege rotas administrativas contra estudantes
      // Apenas redireciona se houver token e role definido
      if (path.startsWith("/admin")) {
        if (token && token.role && token.role !== "COORDINATOR") {
          try {
            return NextResponse.redirect(new URL("/", req.url));
          } catch (redirectError) {
            console.error("Redirect error:", redirectError);
            return NextResponse.next();
          }
        }
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
          // Verifica se o token existe e é válido
          if (!token) {
            return false;
          }
          return true;
        } catch (error) {
          console.error("Authorization callback error:", error);
          // Em caso de erro na autorização, nega acesso
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
  matcher: [
    // Protege rotas de dashboard, admin e outras rotas autenticadas
    "/((?!api|login|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
