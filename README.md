# NestJS Project Template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 📋 Sobre o Projeto

Este é um **template base** pré-configurado de um projeto NestJS para acelerar o desenvolvimento de novos projetos. Ele inclui todas as configurações essenciais e módulos comuns já implementados, permitindo que você comece a desenvolver funcionalidades rapidamente.

## ✨ Funcionalidades Incluídas

- ✅ **Autenticação JWT** completa com guards, strategies e decorators
- ✅ **Módulo de Usuários** com CRUD completo e controle de roles
- ✅ **TypeORM** configurado com PostgreSQL
- ✅ **Docker Compose** para desenvolvimento local
- ✅ **Migrations** configuradas e prontas para uso
- ✅ **Swagger/OpenAPI** para documentação automática
- ✅ **Validação** com class-validator
- ✅ **Hot Reload** configurado para desenvolvimento
- ✅ **Estrutura modular** seguindo best practices do NestJS

## 🚀 Como Usar Este Template

### 1. Clone ou copie este repositório

```bash
# Clone o repositório
git clone <seu-repositorio>
cd project-template

# Ou copie os arquivos para seu novo projeto
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as configurações:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
DB_HOST=postgres  # Use 'postgres' no Docker, 'localhost' localmente
DB_PORT=5432
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=app_password
DB_SSL=false
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3600

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### 4. Inicie o banco de dados com Docker

```bash
docker compose up -d postgres
```

### 5. Execute as migrations (opcional)

```bash
pnpm run migration:run
```

### 6. Inicie o servidor de desenvolvimento

**Com Docker:**
```bash
docker compose up app
```

**Localmente:**
```bash
pnpm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

A documentação da API (Swagger) estará disponível em `http://localhost:3000/docs`

## 📁 Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação
│   ├── decorators/   # @Public(), @Roles(), @CurrentUser()
│   ├── guards/        # JwtAuthGuard, RolesGuard
│   ├── strategies/    # JWT Strategy
│   └── dto/           # DTOs de autenticação
├── users/             # Módulo de usuários
│   ├── entities/      # User entity
│   ├── repositories/  # Repository pattern
│   └── dto/           # DTOs de usuários
├── database/          # Configuração do banco de dados
│   ├── typeorm/       # Configuração TypeORM
│   └── migrations/    # Migrations do banco
└── common/            # Utilitários compartilhados
```

## 🔐 Autenticação

O template inclui autenticação JWT completa:

- **Login**: `POST /auth/login`
- **Logout**: `POST /auth/logout`
- **Refresh Token**: `POST /auth/refresh`
- **Me**: `GET /auth/me`
- **Set First Password**: `POST /auth/set-first-password`

### Decorators Disponíveis

- `@Public()` - Marca rotas como públicas (sem autenticação)
- `@Roles('admin', 'manager')` - Restringe acesso por role
- `@CurrentUser()` - Injeta o usuário atual no controller

## 👥 Usuários

O módulo de usuários inclui:

- Criação, listagem, atualização e remoção de usuários
- Controle de roles (ADMIN, MANAGER, USER)
- Ativação/desativação de usuários
- Alteração de senha

## 🗄️ Banco de Dados

- **PostgreSQL** via Docker
- **TypeORM** com migrations
- **Snake Case** naming strategy
- **Transações** com @nestjs-cls/transactional

### Comandos de Migration

```bash
# Gerar migration
pnpm run migration:generate -- -n NomeDaMigration

# Executar migrations
pnpm run migration:run

# Reverter última migration
pnpm run migration:revert

# Ver status das migrations
pnpm run migration:show
```

## 🐳 Docker

O projeto inclui Docker Compose configurado:

```bash
# Iniciar todos os serviços
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar serviços
docker compose down
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run start:dev      # Inicia em modo watch
pnpm run start:debug    # Inicia em modo debug

# Produção
pnpm run build          # Compila o projeto
pnpm run start:prod     # Inicia em produção

# Testes
pnpm run test           # Testes unitários
pnpm run test:e2e       # Testes end-to-end
pnpm run test:cov       # Coverage

# Migrations
pnpm run migration:generate
pnpm run migration:run
pnpm run migration:revert
```

## 🔧 Customização

Este template é um ponto de partida. Você pode:

1. Adicionar novos módulos conforme necessário
2. Customizar as roles de usuário
3. Adicionar novas entidades e relacionamentos
4. Integrar serviços externos (email, storage, etc)
5. Adicionar testes específicos do seu domínio

## 📚 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Docker** - Containerização
- **Swagger** - Documentação da API
- **class-validator** - Validação de dados

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido para acelerar o início de novos projetos NestJS** 🚀
