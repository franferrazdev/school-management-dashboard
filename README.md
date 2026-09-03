# 📊 School Management Dashboard - Escola de Elite

Um ecossistema Full-Stack de alta performance desenvolvido para gestão escolar pedagógica, governança administrativa e inteligência analítica de dados (Business Intelligence).

## 🔗 Demonstração em Tempo Real / Live Demo

👉 **Acesse o sistema no ar:** [School Management Dashboard](https:school-management-dashboard-woad.vercel.app)

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
<video src="https://github.com/user-attachments/assets/4d24f601-e272-47ac-9738-d34f4c3ef3cb" width="100%" controls muted></video>

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

A high-performance Full-Stack ecosystem built for pedagogical school management, administrative governance, and business intelligence (BI) data analytics [src].

## 🔗 Live Demo

👉 **Access the system online:** [School Management Dashboard](https://school-management-dashboard-woad.vercel.app)

- **Access Email:** `coordenacao@elite.com`
- **Corporate Password:** `@Elite#2026!`

---

## 📸 Visual Presentation

### 1. Corporate Authentication & Security

Restricted access via NextAuth featuring encrypted sessions and role-based access control (RBAC) [src].
![Login Screen](public/images/login-screen.png)

### 2. BI Analytics Panel

Time-series visualization of academic performance using a corporate burgundy color palette (Recharts), featuring a static 70.0 cutting-edge threshold line [src].
![BI Dashboard](public/images/dashboard-chart.png)

### 3. Enrollment & Scholarship Control

Reactive form with native Tailwind animations, integrated with the transactions API for validation of fee exemptions between 10% and 100% [src].
![Enrollment Form](public/images/enrollment-form.png)

### 4. Attendance Tracking & Risk Monitoring

Automated cards and selects parameterized with the 12 core Brazilian subjects (BNCC), with a visual alert for students under low attendance [src].
![Attendance Tracker](public/images/attendance-tracker.png)

### 5. Interactive Student Report Card (Video Demo)

Smooth navigation through the High-Performance Student Sheet displaying UUID masks, allocations, bimonthly fields (1stB, 2ndB, 3rdB, 4thB), and standard ENEM mock exams [src].
<video src="https://github.com/user-attachments/assets/4d24f601-e272-47ac-9738-d34f4c3ef3cb" width="100%" controls muted></video>

---

## 🛠️ Tech Stack and Architecture

- **Framework:** Next.js 14 (App Router) [src]
- **ORM & Database:** Prisma 7 + PostgreSQL hosted in the cloud via Supabase [src]
- **Styling & Design:** Tailwind CSS + `tailwind-scrollbar` (Custom Minimalist Scrollbars) [src]
- **Security & Validation:** NextAuth.js (Encrypted JWT Sessions on the Edge) + Zod v4 Core [src]

---

## 🛑 Critical Business Rules and BNCC Requirements Implemented

### 1. Strict Access Profiles (RBAC)

- **Coordenação (`COORDINATOR`):** Unrestricted Read and Write (CRUD) permissions across the entire ecosystem [src].
- **Professores (`TEACHER`):** Scope restricted to submitting grades and attendance records for linked classrooms [src].
- **Alunos (`STUDENT`):** Pure read-only view isolated to their own technical report cards and academic history [src].

### 2. Enrollment Module and Financial Scholarship Lock

- **Fixed Annual Threshold:** The system strictly blocks the granting of more than **10 active scholarships per academic year** using database atomic transactions (`$transaction`) [src].
- **Exemption Consistency:** The `isScholarshipPercentage` field accepts integer values between 10% and 100% only if the scholarship flag is active, defaulting to 0 automatically otherwise [src].

### 3. Attendance Module and Procedural Idempotency

- **75% Attendance Threshold:** Real-time runtime computation triggers a deep-wine visual highlight (`Bordeaux/Rose`) on cards for students whose attendance drops **below 75%** (At Risk status) [src].
- **Shielded Idempotency:** The server-side API prevents duplicate attendance sheets for the same date/class/subject using procedural operational `findFirst` and `create` lookups to handle concurrency seamlessly [src].

### 4. Automated Grade Sync & BNCC Framework

- **Unified Academic Matrix:** Full integration of the 12 core subjects required by the Brazilian National Curriculum (BNCC) divided by structural knowledge fields [src].
- **Bimonthly Chronological Alignment:** Grades submitted on the performance screen **automatically** populate bimonthly fields (1stB, 2ndB, 3rdB, 4thB) and structural ENEM mock exam records in real-time [src].
