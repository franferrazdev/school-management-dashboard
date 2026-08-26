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
