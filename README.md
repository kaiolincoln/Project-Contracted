# 📄 Sistema de Gestão de Contratos

Um sistema fullstack completo para gerenciamento de contratos empresariais, com controle de clientes, usuários, documentos e histórico de alterações.

---

## 📸 Preview

> Dashboard com métricas em tempo real, alertas de vencimento, listagem de contratos e gestão completa de clientes e usuários.

---

## 🚀 Tecnologias

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## ✨ Funcionalidades

### 🔐 Autenticação e Autorização
- Login com JWT
- Dois níveis de acesso: **ADMIN** e **EDITOR**
- Proteção de rotas por perfil
- Troca de senha com validação

### 📁 Contratos
- Criação, edição e exclusão de contratos
- Status: `ACTIVE`, `EXPIRED`, `CANCELLED`, `PENDING_RENEWAL`
- Histórico completo de alterações
- Upload de documentos (PDF/DOCX)
- Alerta de contratos vencendo nos próximos 30 dias

### 👥 Clientes
- Cadastro completo com CPF/CNPJ, email, telefone e endereço
- Listagem com busca e filtros
- Paginação

### 👤 Usuários
- Criação de usuários pelo painel admin
- Alteração de role (ADMIN/EDITOR)
- Exclusão com proteção (não pode excluir a si mesmo)

### 🎨 Interface
- Design responsivo (mobile e desktop)
- Sidebar com menu hamburguer no mobile
- Loading skeletons
- Toast notifications
- Modal de confirmação elegante
- Página 404 personalizada

### 🔒 Segurança
- Helmet para headers HTTP seguros
- Rate limiting (geral e específico para login)
- Senhas criptografadas com bcrypt
- Validação de dados com Zod
- CORS configurado

---

## 🗄️ Modelagem do Banco

```
User (1)
  └─ role: ADMIN | EDITOR

Client (1) ────────────────────< (N) Contract
                                       │
User (1) ───── responsibleId ──────────┤
                                       │
                                       ├─< (N) Document
                                       ├─< (N) ContractHistory ──── User
                                       └─< (N) Notification ─────── User
```

---

## 🛣️ Endpoints da API

### 🔓 Públicas
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Criar usuário |
| POST | `/session` | Login |

### 🔒 Autenticadas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/me` | Dados do usuário logado |
| PUT | `/me` | Atualizar nome/email |
| PATCH | `/me/Changepassword` | Trocar senha |
| GET | `/users` | Listar usuários (ADMIN) |
| PATCH | `/users/:id/role` | Alterar role (ADMIN) |
| DELETE | `/users/:id` | Remover usuário (ADMIN) |
| POST | `/clients` | Criar cliente |
| GET | `/clients` | Listar clientes |
| GET | `/clients/:id` | Detalhe do cliente |
| PUT | `/clients/:id` | Editar cliente |
| DELETE | `/clients/:id` | Remover cliente (ADMIN) |
| POST | `/contracts` | Criar contrato |
| GET | `/contracts` | Listar contratos |
| GET | `/contracts/expiring` | Contratos vencendo |
| GET | `/contracts/:id` | Detalhe do contrato |
| PUT | `/contracts/:id` | Editar contrato |
| PATCH | `/contracts/:id/status` | Mudar status |
| DELETE | `/contracts/:id` | Excluir contrato (ADMIN) |
| GET | `/contracts/:id/history` | Histórico |
| POST | `/contracts/:id/documents` | Upload de documento |
| GET | `/contracts/:id/documents` | Listar documentos |
| DELETE | `/documents/:id` | Remover documento |
| GET | `/documents/:id/download` | Baixar documento |
| GET | `/notifications` | Listar notificações |
| PATCH | `/notifications/:id/read` | Marcar como lida |
| PATCH | `/notifications/read-all` | Marcar todas como lidas |
| DELETE | `/notifications/:id` | Remover notificação |

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL ou conta no [Neon](https://neon.tech)

### Backend

```bash
# Clone o repositório
git clone https://github.com/kaiolincoln/Project-Contracted.git

# Entre na pasta do backend
cd Project-Contracted/backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Rode as migrations
npx prisma migrate deploy

# Inicie o servidor
npm run dev
```

### Frontend

```bash
# Entre na pasta do frontend
cd Project-Contracted/frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL da API

# Inicie o projeto
npm run dev
```

---

## 🔧 Variáveis de Ambiente

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="sua_chave_secreta_aqui"
NODE_ENV="development"
```

### Frontend (`.env`)
```env
VITE_API_URL="http://localhost:3333"
```

---

## 📁 Estrutura do Projeto

```
Project-Contracted/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controller/
│   │   │   ├── Contracts/
│   │   │   ├── Clients/
│   │   │   ├── User/
│   │   │   ├── Documents/
│   │   │   └── Notification/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── schemas/
│   │   ├── routes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   └── ui/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── contracts/
    │   │   ├── clients/
    │   │   └── users/
    │   ├── services/
    │   ├── types/
    │   └── routes/
    └── package.json
```

---

## 👨‍💻 Autor

**Kaio Lincoln** ,
** Rhikley Altamiro**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/kaiolincoln) (----------)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kaiolincoln) (------)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
