import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/infra/database/prisma-client";
import { comparePassword } from "@/infra/crypto/bcrypt-hasher";

export const authOptions: NextAuthOptions = {
  // Conecta o NextAuth a variável de ambiente do .env
  secret: process.env.NEXTAUTH_SECRET,
  // Configura a estratégia de sessão JWT (JSON Web Token) segura e criptografada
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais de acesso não fornecidas.");
        }

        // Busca o usuário no banco de dados do DBeaver pelo e-mail único
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Nenhum usuário cadastrado com este e-mail.");
        }

        // Compara a senha digitada com o hash criptografado guardado no banco
        const isPasswordValid = await comparePassword(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta. Tente novamente.");
        }

        // Retorna o objeto do usuário satisfeito para alimentar o token
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Repassa o cargo (COORDINATOR, TEACHER, STUDENT)
        };
      },
    }),
  ],

  callbacks: {
    // Injeta as informações do cargo (role) dentro do Token JWT assinado
    async jwt({ token, user }) {
      if (user) {
        ((token.id = user.id), (token.role = user.role));
      }
      return token;
    },

    // Expõe o ID e o Cargo de forma tipada e segura para o Front-End ler via useSession()
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Define a rota da futura tela customizada de login
  },
};

// Exporta os métodos HTTP obrigatórios que o NextAuth exige para operar
const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
