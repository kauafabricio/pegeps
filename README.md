# Pegeps — Plataforma Educacional de Gestão de Projetos em Startups

Monorepo npm workspaces com dois apps e um pacote compartilhado:

| Workspace | Descrição |
|-----------|-----------|
| `apps/api` | API REST (Node.js 20 + Express 5 + TypeScript) |
| `apps/web` | Frontend (Next.js 15 + Tailwind + TypeScript) |
| `packages/domain` | Enums, tipos, catálogo e mapa diagnóstico compartilhados |

## Pré-requisitos

- Node.js ≥ 20
- MongoDB rodando localmente (ou URI remota)

## Instalação

```bash
npm install
```

## Configuração

Copie os arquivos de exemplo e preencha as variáveis:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Variáveis obrigatórias em `apps/api/.env`:

| Variável | Descrição |
|----------|-----------|
| `MONGODB_URI` | String de conexão do MongoDB |
| `JWT_SECRET` | String aleatória ≥ 32 chars |
| `GEMINI_API_KEY` | Chave do Google AI Studio |

## Executar em desenvolvimento

```bash
npm run dev
```

Isso inicia ambos os servidores em paralelo:
- API em `http://localhost:3001`
- Web em `http://localhost:3000`

O Next.js reescreve `/api/*` para a API (sem problemas de CORS/cookie).

## Popular banco de dados (seeds)

```bash
npm run seed -w apps/api
```

## Build de produção

```bash
npm run build
```

## Estrutura do monorepo

```
pegeps/
├── apps/
│   ├── api/          # Express 5 API
│   └── web/          # Next.js 15 frontend
├── packages/
│   └── domain/       # Tipos e constantes compartilhados
├── tsconfig.base.json
├── .prettierrc
└── package.json
```

## Decisões de projeto

| Decisão | Razão |
|---------|-------|
| `packages/domain` em vez de copiar enums | Evita divergência entre front e back |
| Rewrite Next → API na mesma origem | Cookies HttpOnly funcionam sem CORS adicional |
| `SameSite=Lax` + `Secure` em prod | Proteção CSRF adequada sem bloquear navegação normal |
| Mapa diagnóstico em código | Fácil de editar, sem banco desnecessário para lógica fixa |
| StorageService abstrato (disco → S3) | Troca sem alterar a camada de serviço |
