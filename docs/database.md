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
- `role`: ENUM ('COODINATOR''TEACHER', 'STUDENT')
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
- `name`: VARCHAR(50) (Ex.: "3º ANo - Medicina/ENEM")
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
- `period`: ENEM ('BIMESTRE_1', 'BIMESTRE_2', 'BIMESTRE_3', 'BIMESTRE_4')
- `created_at`: TIMESTAMP
