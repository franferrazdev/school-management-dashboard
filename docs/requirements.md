# 📝 Requisitos do Sistema · Dashboard de Gerenciamento Escolar

Este documento descreve as regras de negócio de alto nível, os escopos de usuários e as restrições de segurança que governam a aplicação.

---

## 👥 Perfis de Usuário e Permissões (RBAC)

O sistema opera sob controle estrito de acessos baseado em papéis de permissão:

### 1. Coordenação (`COORDINATOR`)

- **Acesso Total:** Possui permissões irrestritas de Leitura e Escrita (CRUD) em todo o sistema.
- Pode matricular e gerenciar alunos e professores.
- Pode criar turmas, vincular disciplinas e abrir/fechar períodos letivos.

### 2. Professores (`TEACHER`)

- **Escopo Vinculado:** só visualizam e editam dados das turmas e disciplinas onde estão formalmente vinculados.
- **Gestão de Notas:** Podem lançar, atualizar e remover notas apenas dos alunos pertencentes às suas respectivas turmas.
- Não possuem permissão para criar turmas, cadastrar novos alunos ou abrir novos períodos letivos.

### 3. Alunos (`STUDENT`)

- **Visualização Pura:** Possuem acesso de leitura restrita (apenas visualização).
- **Escopo Isolado:** Conseguem visualizar unicamente o próprio boletim, histórico de notas e faltas.
- Não possuem nenhuma rota de escrita ou alteração no sistema.

---

## ⚙️ Regras de Negócio Estritas (Grades Domain)

- **Validação de Limites:** Uma nota numérica deve ser obrigatoriamente um valor decimal contido no intervalo de **0.0 a 100.0**.
- **Bloqueio de Período:** Nenhuma nota pode ser lançada, editada ou removida se o período letivo correspondente (ex.: 1º Bimestre) já estiver marcado no sistema como "Fechado" pela Coordenação.
- **Rastreabilidade:** Toda nota lançada precisa estar obrigatoriamente associada a um ID de aluno existente, a um ID de disciplina válida e ao ID do professor que realizou o lançamento.

---

## 🎓 Regras de Alta Performance e Controle de Bolsas (Foco ENEM)

### 1. Gestão Estrita de Bolsas de Estudo (`SCHOLARSHIP_CONTROL`)

- **Limite Anual Fixo:** O sistema possui uma trava de segurança que impede a concessão de mais de **10 bolsas de estudo ativas por ano letivo**.
- **Mapeamento de Desconto:** Alunos bolsistas devem possuir uma flag descritiva no cadastro indicando o percentual da bolsa (ex.: 50%, 100%).

### 2. Monitoramento de Rendimento Rígido (Métricas ENEM)

- **Alerta de Desempenho:** O sistema deve calcular automaticamente a média do aluno. Caso a nota de qualquer simulado ou disciplina fique **abaixo de 70.0**, o perfil do aluno recebe uma tag visual automática de `Atenção/Acompanhamento`.
- **Simulados Padrão TRI:** O lançamento de notas deve aceitar a diferenciação entre avaliações regulares e **Simulados Modelo ENEM**, permitindo relatórios focados em projeção de notas para vestibulares.

---

## 📈 Módulo de Analytics e Business Intelligence (Métricas Visuais)

O painel analítico deve processar e renderizar os dados de rendimento através de componentes gráficos de alta performance com a paleta em tons de vinho.

### 1. Gráfico de Evolução Temporal (Recharts LineChart)

- **Objetivo:** Exibir a oscilação das médias das notas do aluno ou da turma ao longo dos quatro bimestres.
- **Linha de Corte Rígida:** O gráfico deve plotar uma linha de referência estática e horizontal exatamente no valor de **70.0 pontos**, servindo de indicador visual imediato para metas de alta performance do ENEM.
- **Diferenciação por Tipo:** Deve permitir a filtragem visual separando o progresso de Provas Regulares e Simulados Modelo ENEM.

### 2. Painel de Distribuição de Desempenho (Recharts BarChart)

- **Mapeamento TRI:** Exibir a quantidade de alunos agrupados por faixas de notas (ex.: menos de 50, entre 50 e 70, e acima de 70 pontos).
- **Gatilhos Visuais:** Alunos na faixa abaixo de 70.0 devem ser destacados na cor vinho profundo (`Bordeaux/Rose`), sinalizando a necessidade de inclusão no plano de recuperação pedagógica.

---

## 👥 Módulo de Matrículas e Controle Rígido de Bolsas

Este módulo governa o ingresso de estudantes e a concessão de incentivos financeiros, aplicando travas de consistência diretamente na camada de domínio.

### 1. Regra de Negócio Crítica (A Trava das 10 Bolsas)

- **Restrição de Escopo:** A instituição limita estritamente a concessão de bolsas de estudo a no máximo **10 bolsas ativas por ano letivo**.
- **Validação Automatizada:** Antes de efetivar uma matrícula com `isScholarship: true`, o caso de uso deve consultar o banco de dados e contar quantos estudantes ativos possuem o indicador de bolsa ativo no mesmo ano de admissão (`yearOfAdmission`).
- **Gatilho de Rejeição:** Caso o contador atinja o limite de 10, o sistema deve abortar a transação e disparar uma exceção de domínio proibindo a matrícula.

### 2. Controle de Percentual de Isenção

- **Intervalo Válido:** O campo `isScholarshipPercentage` deve aceitar valores inteiros estritamente entre **10% e 100%**.
- **Consistência de Estado:** Se `isScholarship` for falso, o percentual deve ser forçado a `0` de forma automática.

---

## 📅 Módulo de Frequência e Controle de Infrequência

Este módulo governa o registro de chamadas diárias pelos professores e calcula os indicadores de risco de reprovação de forma automatizada.

### 1. Regra de Negócio Rígida (Limite de 75% de Presença)

- **Cálculo de Alerta:** O sistema deve monitorar em tempo real a proporção entre faltas e dias letivos registrados para cada estudante.
- **Gatilho de Risco:** Estudantes que atingirem um percentual de presença **abaixo de 75%** (ou seja, mais de 25% de faltas acumuladas) devem ser marcados automaticamente com o status visual de `Risco de Reprovação por Infrequência`.
- **Diferenciação Visual:** Na listagem da chamada, o card do estudante sob risco deve receber um destaque sutil na cor vinho profundo (`Bordeaux/Rose`), alertando o corpo pedagógico instantaneamente.

### 2. Idempotência da Chamada Diária

- **Chave Única de Registro:** O sistema só permite **uma única folha de chamada por turma, disciplina e data**.
- **Validação de Duplicidade:** Caso o professor tente reenviar a chamada do mesmo dia, o caso de uso deve interceptar a operação e realizar a atualização dos registros existentes (_upsert_), impedindo a duplicidade de dados no banco.

---

# 📝 System Requirements · School Management Dashboard (English Version)

This document describes the high-level business rules, user scopes, and security constraints governing the application.

---

## 👥 User Profiles and Permissions (RBAC)

The system operates under strict access control based on permission roles:

### 1. Coordination (`COORDINATOR`)

- **Full Access:** Has unrestricted Read and Write (CRUD) permissions across the entire system.
- Can enroll and manage students and teachers.
- Can create classes, link disciplines, and open/close academic periods.

### 2. Teachers (`TEACHER`)

- **Linked Scope:** Can only view and edit data for classes and disciplines where they are formally linked.
- **Grades Management:** Can submit, update, and remove grades only for students belonging to their respective classes.
- Do not have permission to create classes, register new students, or open new academic periods.

### 3. Students (`STUDENT`)

- **Pure View:** Have restricted read-only access (visualization only).
- **Isolated Scope:** Can uniquely view their own report card, grade history, and attendance records.
- Do not have any write or mutation routes within the system.

---

## ⚙️ Strict Business Rules (Grades Domain)

- **Limits Validation:** A numeric grade must strictly be a decimal value contained within the range of **0.0 to 100.0**.
- **Period Blocking:** No grade can be submitted, edited, or removed if the corresponding academic period (e.g., 1st Quarter) is already marked in the system as "Closed" by the Coordination.
- **Traceability:** Every submitted grade must be rigidly associated with an existing student ID, a valid discipline ID, and the ID of the teacher who performed the entry.

---

## 🎓 High-Performance Rules and Scholarship Control (ENEM Focus)

### 1. Strict Scholarship Management (`SCHOLARSHIP_CONTROL`)

- **Fixed Annual Cap:** The system features a security lock that prevents granting more than **10 active scholarships per academic year**.
- **Discount Mapping:** Scholarship students must have a descriptive flag in their profile indicating the scholarship percentage (e.g., 50%, 100%).

### 2. Rigid Performance Monitoring (ENEM Metrics)

- **Performance Alert:** The system must automatically calculate the student's average score. If any exam, project, or simulated test grade drops below **70.0**, the student's profile automatically receives a visual warning tag for `Attention/Academic Intervention`.
- **IRT-Standard Simulated Exams:** Grade submissions must accept the differentiation between regular evaluations and **ENEM-Model Simulated Exams**, allowing reports focused on projection scores for college admission tests.

## 📅 Módulo de Frequência, Boletim por Bimestres e Matriz BNCC

Este módulo expande o diário de classe digital para conformidade regulatória nacional e automatiza o fechamento cronológico de notas.

### 1. Matriz Curricular Obrigatória (Novo Ensino Médio)

- **Componentes Integrados:** O sistema mapeia os 12 componentes curriculares obrigatórios da BNCC divididos por Áreas do Conhecimento (Linguagens, Matemática, Ciências da Natureza e Ciências Humanas) tanto no seletor de chamadas diárias quanto no formulário de notas.

### 2. Sincronismo Automático por Bimestres (1ºB, 2ºB, 3ºB, 4ºB)

- **Fechamento de Médias:** As avaliações submetidas na tela de desempenho alimentam **automaticamente** e em tempo real as colunas correspondentes de cada período letivo (BIMESTRE_1 a BIMESTRE_4) dentro da Ficha Cadastral do Aluno.
- **Isolamento de Simulados:** A API de perfil realiza a triagem imediata separando exames tradicionais/projetos de pesquisa do rendimento em Simulados Modelo ENEM (Rígido), blindando o cálculo contra distorções estatísticas.

### 3. Idempotência Procedural de Frequência

- **Resolução de Schema Drift:** O salvamento de presença utiliza travas atômicas baseadas em checagens procedurais explícitas com cláusulas de `findFirst` e `create`. Essa abordagem elimina conflitos invisíveis de fuso horário em campos `@db.Date` do Prisma 7 e sana de forma definitiva falhas internas de servidor (Erro 500) em ambiente Serverless.

---

## 📈 Analytics and Business Intelligence Module (Visual Metrics) - English Version

The analytical dashboard must process and render academic performance data through high-performance chart components customized within the institutional burgundy palette.

### 1. Timeline Evolution Chart (Recharts LineChart)

- **Objective:** Display the fluctuation of student or class grade averages across the four academic quarters.
- **Rigid Threshold Line:** The chart must plot a static horizontal reference line exactly at **70.0 points**, serving as an immediate visual indicator for high-performance ENEM targets.
- **Type Differentiation:** It must allow visual filtering to separate the progress of Regular Exams from ENEM-Model Simulated Tests.

### 2. Performance Distribution Panel (Recharts BarChart)

- **IRT Mapping:** Display the volume of students grouped by grade ranges (e.g., below 50, between 50 and 70, and above 70 points).
- **Visual Triggers:** Students scoring within the range below 70.0 must be highlighted in a deep wine color (`Bordeaux/Rose`), signaling the need for immediate academic intervention and tutoring plans.

---

## 👥 Enrollment and Strict Scholarship Control Module (English Version)

This module governs student admissions and the granting of financial incentives, enforcing consistency constraints directly within the domain layer.

### 1. Critical Business Rule (The 10-Scholarship Lock)

- **Scope Restriction:** The institution strictly limits the granting of school scholarships to a maximum of **10 active scholarships per academic year**.
- **Automated Validation:** Before finalizing any enrollment with `isScholarship: true`, the use case must query the database and count how many active students have the scholarship indicator active for the same admission year (`yearOfAdmission`).
- **Rejection Trigger:** If the counter reaches the limit of 10, the system must abort the transaction and throw a domain exception blocking the enrollment.

### 2. Exemption Percentage Control

- **Valid Range:** The `isScholarshipPercentage` field must accept integer values strictly between **10% and 100%**.
- **State Consistency:** If `isScholarship` is false, the percentage must be automatically forced to `0`.

---

## 📅 Attendance and Infrequency Control Module (English Version)

This module governs the recording of daily roll calls by teachers and automatically computes student failing risk indicators due to absenteeism.

### 1. Strict Business Rule (75% Attendance Threshold)

- **Alert Computation:** The system must monitor in real-time the ratio between absences and total school days recorded for each student.
- **Risk Trigger:** Students who fall **below a 75% attendance rate** (i.e., exceeding 25% of accumulated absences) must be automatically flagged with the visual status `At Risk of Failing due to Infrequency`.
- **Visual Differentiation:** In the roll call interface, the card of any student classified as at-risk must feature a sublte deep wine highlight (`Bordeaux/Rose`), immediately alerting the pedagogical board.

### 2. Daily Roll Call Idempotency

- **Unique Record Key:** The system strictly permits **only one roll call sheet per class, subject, and calendar date**.
- **Duplication Validation:** If a teacher attempts to resubmit the roll call for the exact same day, the use case must intercept the operation and update the existing logs (_upsert_), preventing any data duplication in the database.

---

## 📅 ​​Attendance Module, Quarterly Report Cards, and BNCC Matrix

This module extends the digital class register to ensure national regulatory compliance and automates the chronological finalization of grades.

### 1. Mandatory Curriculum Matrix (New High School Model)

- **Integrated Components:** The system maps the 12 mandatory BNCC curriculum components—categorized by Areas of Knowledge (Languages, Mathematics, Natural Sciences, and Human Sciences)—within both the daily attendance selector and the grading form.

### 2. Automatic Quarterly Synchronization (Q1, Q2, Q3, Q4)

- **Grade Finalization:** Assessments submitted via the performance screen **automatically** and in real-time populate the corresponding columns for each academic period (Q1 through Q4) in the Student Record.
- **Mock Exam Isolation:** The profile API performs immediate sorting to separate traditional exams and research projects from performance on ENEM-style mock exams (Strict Mode), shielding the calculation from statistical distortions.

### 3. Procedural Attendance Idempotency

- **Schema Drift Resolution:** Attendance saving operations utilize atomic locks based on explicit procedural checks involving `findFirst` and `create` clauses. This approach eliminates invisible time-zone conflicts in Prisma 7 `@db.Date` fields and definitively resolves internal server errors (Error 500) in serverless environments.
