# 🚀 Guia de Deploy em Produção / Production Deploy Guide

Este documento centraliza as instruções para conectar o ecossistema Next.js 14 ao banco de dados PostgreSQL em nuvem do Supabase.

## 🗄️ 1.Configuração do Banco no Supabase (Production DB)

1. Acesse o painel do [Supabase](https://supabase.com).
2. Crie um novo projeto chamado `school-management-dashboard`.
3. Vá em **Project Setting** -> **Database**.
4. Procure pela seção **Connection String** e mude a aba para **URI**.
5. Copie a URL de conexão. Ela terá o formato: `postgresql://postgres:[PASSWORD]@//supabase.com`

> ⚠️ **Nota de Infraestrutura (Prisma 7):** Como usei o pool de conexões do Supabase (porta `6443`), adicionamos obrigatoriamente a flag `?pgbouncer=true` no final da string e injetamos o parâmetro `connection_limit=1` para que as Serverless Functions da Vercel não travem o banco por excesso de requisições.

## 🌐 2. Variáveis de Ambiente na Vercel (Environment Variables)

Ao configurar o projeto na [Vercel](https://vercel.com), injete as seguintes chaves secretas:

| Chave (Key)                                        | Valor (Value)                           | Descrição                                      |
| :------------------------------------------------- | :-------------------------------------- | :--------------------------------------------- |
| `DATABASE_URL` _Sua URI do Supabase com pGBouncer_ | Conexão física com o banco de dados     |
| `NEXTAUTH_SECRET`                                  | _Uma string aleatória de 32 caracteres_ | Chave de criptografia dos cookies de sessão    |
| `NEXTAUTH_URL`                                     | `https://vercel.app`                    | URL oficial de produção para redirecionamentos |
