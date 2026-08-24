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
- **Gestão de Notas:** Podem lançar, atualizar e remover notas apenas dos alunos pertencentes às suas respoectivas turmas.
- Não possuem permissão para criar turmas, cadastras novos alunos ou abrir novos períodos letivos.

### 2. Alunos (`STUDENT`)

- **Visualização Pura:** Possuem acesso de leitura restrita (apenas visualização).
- **Escopo Isolado:** Conseguem visualizar unicamente o próprio boletim, histórico de notas e faltas.
- Não possuem nenhuma rota de escrita ou alteração no sistema.

---

## ⚙️ Regras de Negócio Estritas (Grandes Domain)

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
