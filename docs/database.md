# 🗄️ Modelagem do Banco de Dados · PostgreSQL Schema

Mapeamento relacional das tabelas para o ecossistema de alto rendimento escolar.

---

## 📊 Dicionário de Tabelas e Relações

### 1. Tabela: `User` (Usuários)

Armazena todos os perfis com acesso ao sistema sob controle de papéis (RBAC).

- `id`: UUID (Primary Key)
- `name`: VARCHAR(255)
- `email`: VARCHAR(255) (Unique)
- `password_hash`: VARCHAR(255)
- `role`: ENUM ('COORDINATOR', 'TEACHER', 'STUDENT')
- `created_at`: TIMESTAMP

### 2. Tabela: `StudentProfile` (Informações do Aluno)

Extensão da tabela User, contendo as regras específicas de bolsas de elite e acompanhamento técnico.

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> User.id, On Delete Cascade)
- `is_scholarship`: BOOLEAN (Indica se é bolsista)
- `scholarship_percentage`: INT (Percentual de desconto, ex.: 100)
- `year_of_admission`: INT (Ano de ingressão)
- `status`: ENUM ('ACTIVE', 'WARNING', 'SUSPENDED') (Alerta de nota < 70)

### 3. Tabela: `Class` (Turmas do Ensino Médio)

Mapeamento das turmas focadas em vestibulares (ex.: 1º Ano A, 3º Ano B).

- `id`: UUID (Primary Key)
- `name`: VARCHAR(50) (Ex.: "3º Ano - Medicina/ENEM")
- `year`: INT (Ex.: 2026)
- `is_active`: BOOLEAN

### 4. Tabela: `Grade` (Notas e Avaliações)

Centraliza o lançamento rigoroso de avaliações e simulados modelo ENEM.

- `id`: UUID (Primary Key)
- `value`: DECIMAL(5,2) (Nota de 0.00 a 100.00)
- `type`: ENUM ('REGULAR_EXAM', 'SIMULATED_ENEM', 'PROJECT')
- `student_id`: UUID (Foreign Key -> StudentProfile.id)
- `teacher_id`: UUID (Foreign Key -> User.id)
- `class_id`: UUID (Foreign Key -> Class.id)
- `period`: ENUM ('BIMESTRE_1', 'BIMESTRE_2', 'BIMESTRE_3', 'BIMESTRE_4')
- `created_at`: TIMESTAMP

---

# 🗄️ Database Modeling · PostgreSQL Schema (English Version)

Relational mapping of tables for the high-performance school ecosystem.

---

## 📊 Table Dictionary and Relationships

### 1. Table: `User` (Users)

Stores all profiles with system access under role-based control (RBAC).

- `id`: UUID (Primary Key)
- `name`: VARCHAR(255)
- `email`: VARCHAR(255) (Unique)
- `password_hash`: VARCHAR(255)
- `role`: ENUM ('COORDINATOR', 'TEACHER', 'STUDENT')
- `created_at`: TIMESTAMP

### 2. Table: `StudentProfile` (Student Information)

Extension of the User table, containing specific rules for elite scholarships and technical monitoring.

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> User.id, On Delete Cascade)
- `is_scholarship`: BOOLEAN (Indicates if the student is a scholarship holder)
- `scholarship_percentage`: INT (Discount percentage, e.g., 100)
- `year_of_admission`: INT (Enrollment year)
- `status`: ENUM ('ACTIVE', 'WARNING', 'SUSPENDED') (Grade warning alert < 70)

### 3. Table: `Class` (High School Classes)

Mapping of classes focused on college admissions exams (e.g., 1st Year A, 3rd Year B).

- `id`: UUID (Primary Key)
- `name`: VARCHAR(50) (E.g., "3rd Year - Medicine/ENEM")
- `year`: INT (E.g., 2026)
- `is_active`: BOOLEAN

### 4. Table: `Grade` (Grades and Evaluations)

Centralizes the rigorous entry of evaluations and ENEM-model simulated exams.

- `id`: UUID (Primary Key)
- `value`: DECIMAL(5,2) (Grade score from 0.00 to 100.00)
- `type`: ENUM ('REGULAR_EXAM', 'SIMULATED_ENEM', 'PROJECT')
- `student_id`: UUID (Foreign Key -> StudentProfile.id)
- `teacher_id`: UUID (Foreign Key -> User.id)
- `class_id`: UUID (Foreign Key -> Class.id)
- `period`: ENUM ('BIMESTRE_1', 'BIMESTRE_2', 'BIMESTRE_3', 'BIMESTRE_4')
- `created_at`: TIMESTAMP
