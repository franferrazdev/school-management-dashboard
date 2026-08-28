import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";

// Inicializa o pool de conexões lendo o .env real
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Gera o hash seguro da nova senha complexa da instituição
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("@Elite#2026!", salt);

  // Injeta o primeiro Coordenador de testes na tabela usando upsert idempotente
  const coordinator = await prisma.user.upsert({
    where: { email: "coordenacao@elite.com" },
    update: { passwordHash },
    create: {
      name: "Maria Silva",
      email: "coordenacao@elite.com",
      passwordHash: passwordHash,
      role: "COORDINATOR",
    },
  });

  console.log("Banco de dados populado com sucesso!");
  console.log("Usuario de teste criado:", coordinator.email);
}

main()
  .catch((e) => {
    console.error("Erro ao rodar o seed do banco:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Desconecta o Prisma e fecha o pool de forma limpa para liberar o console Linux
    await prisma.$disconnect();
    await pool.end();
  });
