# Lion UI - Employee Management Frontend

Frontend React para o sistema de controle de funcionários, integrado com a API NestJS.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui**
- **React Router** (routing)
- **Axios** (HTTP client)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API rodando (lion-api)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173` (ou próxima porta disponível).

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Router setup
├── index.css                   # Tailwind + global styles
├── lib/
│   └── utils.ts                # Utility functions (cn)
├── types/
│   └── index.ts                # TypeScript interfaces
├── services/
│   └── api.ts                  # Axios instance + API calls
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── components/
│   ├── ProtectedRoute.tsx      # Route guard
│   ├── EmployeeFormModal.tsx   # Create/Edit modal
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       └── checkbox.tsx
└── pages/
    ├── Login.tsx               # Login page
    └── Employees.tsx           # Employee list + CRUD
```

## Features

- **JWT Authentication** - Login com token armazenado em localStorage
- **Session Restore** - Sessão restaurada automaticamente ao recarregar
- **Role-Based UI** - Botões de criar/editar visíveis apenas para ADMIN
- **Protected Routes** - Redirecionamento automático para login
- **CRUD Operations** - Criar, editar e deletar funcionários (ADMIN)
- **Error Handling** - Mensagens de erro e loading states

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@local.com | Admin@123 |
| USER | user@local.com | User@123 |

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login |
| GET | /auth/me | Get current user |
| GET | /employees | List employees |
| POST | /employees | Create employee (ADMIN) |
| PUT | /employees/:id | Update employee (ADMIN) |
| DELETE | /employees/:id | Delete employee (ADMIN) |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```
