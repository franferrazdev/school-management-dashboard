"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "next/dist/build/output/log";

// Esquema de validação estrita do Zod v4 para as credenciais
// RegEx de segurança máxima para validação de senhas corporativas
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const CreateLoginSchema = z.object({
  // Padrão enxuto e estável para formulários HTML5
  email: z.email("O formato do e-mail fornecido e invalido."),
  password: z.string().min(8, "A senha deve possuir no minimo 8 caracteres."),
});

type LoginInput = z.infer<typeof CreateLoginSchema>;

export function LoginScreen() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(CreateLoginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setApiError(null);

    // Dispara a tentativa de autenticação pelo NextAuth
    const result = await signIn("credentials", {
      redirect: false, // Bloqueia o redirect automático para tratar o erro na UI
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setApiError(result.error);
      setIsLoading(false);
    } else {
      // Login bem-sucedido! Redireciona o usuário para o Dashboard principal
      router.push("/");
      router.refresh();
    }
  };
  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 rounded-xl shadow-2xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-rose-400">
            School Management
          </h1>
          <p className="text-sm text-stone-400">
            Painel Institucional - Controle de Alto Rendimento Acadêmico
          </p>
        </header>

        {/* Alerta de erro vindo do Servidor de Autenticação */}
        {apiError && (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-xs text-center font-medium">
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("Erros de Validação do Zod:", errors),
          )}
          className="space-y-4 text-stone-100"
        >
          {/* Campo: E-mail institucional */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              E-mail Institucional
            </label>
            <input
              type="email"
              {...register("email")}
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-rose-500 text-sm transition-colors"
              placeholder="professor@escola.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo: Senha de acesso */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Senha de Acesso
            </label>
            <input
              type="password"
              {...register("password")}
              className="p-2.5 bg-stone-950 botder border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-rose-500 text-sm transition-colors"
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="text-xs text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botão de Ação Customizado */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 p-3 bg-rose-700 hover:bg-rose-800 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold rounded-lg transition-colors text-sm cursor-pointer shadow-lg shadow-rose-950/20"
          >
            {isLoading ? "Autenticando Credenciais..." : "Acessar o Painel"}
          </button>
        </form>

        {/* Guia de Credenciais Demo para Recrutadores e Testes Locais */}
        <div className="pt-4 botder-t border-stone-800 text-center -space-y-1.5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Acesso Demostrativo (Portfólio)
          </p>
          <div className="bg-stone-950 p-2.5 border border-stone-800 rounded-lg text-left text-xs font-mono space-y-1 text-stone-300">
            <div>
              <span className="text-rose-400">Email:</span>{" "}
              coordenacao@elite.com
            </div>
            <div>
              <span className="text-rose-400">Senha:</span> @Elite#2026!
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
