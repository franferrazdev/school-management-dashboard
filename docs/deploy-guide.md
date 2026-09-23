# 🚀 Guia de Deploy em Produção / Production Deploy Guide

Este documento centraliza as instruções para conectar o ecossistema Next.js 14 ao banco de dados PostgreSQL em nuvem do Supabase.

## 🗄️ 1.Configuração do Banco no Supabase (Production DB)

1. Acesse o painel do [Supabase](https://supabase.com).
2. Crie um novo projeto chamado `school-management-dashboard`.
3. Vá em **Project Setting** -> **Database**.
4. Procure pela seção **Connection String** e mude a aba para **URI**.
5. Copie a URL de conexão PostgreSQL exibida pelo Supabase. Não use a URL da API do projeto.

> ⚠️ **Nota de Infraestrutura (Prisma 7):** Para as Serverless Functions da Vercel, use a connection string do pooler de transações do Supabase, normalmente na porta `6543`, com `?pgbouncer=true`. Confirme host, porta e parâmetros na tela **Connect** do próprio projeto.

## 🌐 2. Variáveis de Ambiente na Vercel (Environment Variables)

Ao configurar o projeto na [Vercel](https://vercel.com), injete as seguintes chaves secretas:

| Chave (Key)                                     | Valor (Value)                            | Descrição                                      |
| :---------------------------------------------- | :--------------------------------------- | :--------------------------------------------- |
| `DATABASE_URL` _Sua URI PostgreSQL do Supabase_ | Conexão usada pelo Prisma em runtime     |
| `DIRECT_URL` _Opcional_                         | Conexão direta usada por comandos Prisma |
| `NEXTAUTH_SECRET`                               | _Uma string aleatória de 32 caracteres_  | Chave de criptografia dos cookies de sessão    |
| `NEXTAUTH_URL`                                  | `https://vercel.app`                     | URL oficial de produção para redirecionamentos |

`DATABASE_URL` precisa estar cadastrada no ambiente **Production** da Vercel. Depois de alterar uma variável, faça um novo deploy. O código usa `DIRECT_URL` somente como fallback; em produção, prefira manter `DATABASE_URL` apontando para o pooler.
