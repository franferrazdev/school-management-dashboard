import { UserRole } from "@generated/prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // Estende o objeto de Usuário original do NextAuth
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }

  // Estende o objeto de Sessão para que o Front-End enxergue o cargo via useSession()
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // Estende o Token JWT para que ele armazene o cargo com segurança
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}
