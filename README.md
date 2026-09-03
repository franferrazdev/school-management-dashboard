# 📊 School Management Dashboard - Escola de Elite

Um ecossistema Full-Stack de alta performance desenvolvido para gestão escolar pedagógica, governança administrativa e inteligência analítica de dados (Business Intelligence).

## 🔗 Demonstração em Tempo Real / Live Demo

👉 **Acesse o sistema no ar:** [School Management Dashboard](https://vercel.app)

- **E-mail de Acesso:** `coordenacao@elite.com`
- **Senha Corporativa:** `@Elite#2026!`

---

## 📸 Demonstração Visual / Visual Presentation

### 1. Autenticação e Segurança Corporativa / Corporate Authentication

Acesso restrito via NextAuth com sessões criptografadas e controle de credenciais baseado em papéis (RBAC).
![Tela de Login](public/images/login-screen.png)

### 2. Painel de Business Intelligence / BI Analytics Panel

Exibição gráfica temporal do rendimento acadêmico na paleta corporativa em tons de vinho (Recharts), com linha de corte fixa em 70.0 pontos.
![Dashboard de BI](public/images/dashboard-chart.png)

### 3. Controle Rígido de Bolsas / Enrollment & Scholarship Control

Formulário reativo com animações nativas do Tailwind, integrado à API de transações para validação de isenções entre 10% e 100%.
![Formulário de Matrículas](public/images/enrollment-form.png)

### 4. Diário de Classe Unificado / Unified Class Journal

Cards e seletores parametrizados com os 12 componentes curriculares obrigatórios da BNCC e destaque visual para alunos com infrequência.
![Chamada Diária](public/images/attendance-tracker.png)

### 5. Ficha de Auditoria e Boletim por Bimestres (Vídeo) / Student Report Card

Navegação fluida pela Ficha Cadastral de Alta Performance exibindo máscaras de UUID, alocações e notas reais sincronizadas por Bimestres (1ºB, 2ºB, 3ºB, 4ºB) e Simulados ENEM.
<video src="public/videos/student-profile-sheet-demo.webm" width="100%" controls muted></video>

---

## 🛠️ Tecnologias e Arquitetura do Ecossistema

- **Framework:** Next.js 14 (App Router)
- **ORM & Banco de Dados:** Prisma 7 + PostgreSQL hospedado na nuvem pelo Supabase
- **Estilização & Design:** Tailwind CSS + `tailwind-scrollbar` (Rolagem Customizada Minimalista)
- **Segurança & Validação:** NextAuth.js (Sessões Criptografadas JWT na borda) + Zod v4 Core

---

## 🛑 Regras de Negócio e Requisitos de Governança (BNCC)

### 1. Perfis de Acesso Estritos (RBAC)

- **Coordenação (`COORDINATOR`):** Permissões irrestritas de Leitura e Escrita (CRUD) em todo o ecossistema.
- **Professores (`TEACHER`):** Escopo restrito ao lançamento de notas e presenças de turmas vinculadas.
- **Alunos (`STUDENT`):** Visualização pura e isolada do próprio boletim técnico e histórico.

### 2. Módulo de Matrículas e Trava Financeira de Bolsas

- **Limite Anual Fixo:** O sistema possui uma trava de segurança que impede a concessão de mais de **10 bolsas de estudo ativas por ano letivo** via transação atômica (`$transaction`).
- **Consistência de Isenção:** O campo `isScholarshipPercentage` aceita valores entre 10% e 100% apenas se a flag de bolsa for ativa, sendo forçada a 0 automaticamente em casos regulares.

### 3. Módulo de Frequência e Idempotência Procedural

- **Limite de 75% de Presença:** Alunos com presença abaixo de 75% são destacados automaticamente com o status visual na cor vinho profundo (`Bordeaux/Rose`), alertando sobre o risco de reprovação.
- **Idempotência Blindada:** A API impede folhas de presença duplicadas para a mesma data/turma/matéria usando travas com cláusulas de `findFirst` e `create` procedurais, eliminando falhas de concorrência.

### 4. Sincronismo Automático e Matriz Curricular BNCC

- **Matriz Curricular Unificada:** Integração dos 12 componentes obrigatórios do Novo Ensino Médio divididos por áreas do conhecimento.
- **Alinhamento Cronológico de Médias:** As notas submetidas na tela de desempenho alimentam **automaticamente** e em tempo real as colunas do 1ºB, 2ºB, 3ºB e 4ºB da Ficha do Aluno, separando as avaliações regulares dos Simulados Modelo ENEM.

---

# 📊 School Management Dashboard - English Version

A high-performance Full-Stack ecosystem built for pedagogical school management, administrative governance, and business intelligence (BI) data analytics.

## 🛑 Critical Business Rules and BNCC Requirements Implemented

1. **Financial Governance Lock:** The system strictly blocks the granting of more than **10 active scholarships per academic year** using database atomic transactions (`$transaction`).
2. **Roll Call Idempotency:** The server-side API prevents duplicate attendance sheets for the same class/date using procedural operational `findFirst` and `create` lookups.
3. **Infrequency Alert (75% Threshold):** Real-time runtime computation triggers a deep-wine visual highlight on cards for students whose attendance drops **below 75%** (At Risk status).
4. **Automated Grade Sync & BNCC Framework:** Fully integrated mapping of the 12 core Brazilian subjects. Grades submitted on the performance screen **automatically** populate the bimonthly fields (1stB, 2ndB, 3rdB, 4thB) and structural ENEM mock exam records.
