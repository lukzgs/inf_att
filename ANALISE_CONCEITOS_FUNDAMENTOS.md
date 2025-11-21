# Análise Detalhada: Conceitos e Fundamentos do Projeto inf_att

## 📋 Sumário Executivo

O **inf_att** é um **Sistema de Controle de Frequência Acadêmica** que implementa uma arquitetura em camadas com tecnologias modernas. O projeto demonstra uma sólida compreensão de padrões de engenharia de software, segurança, persistência de dados e desenvolvimento full-stack, sendo adequado como base para um TCC em Engenharia de Software ou Informática.

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo Principal
Desenvolver uma plataforma web para gerenciar presença de alunos em ambientes acadêmicos, permitindo:
- Autenticação de usuários com diferentes papéis (admin, professor, aluno)
- Criação e gerenciamento de cursos, disciplinas e turmas
- Controle de aulas com abertura/fechamento
- Registro de presença com auditoria completa
- Visualização de relatórios e estatísticas

### 1.2 Escopo Técnico
- **Arquitetura**: Monolítica modular com separação clara entre frontend e backend
- **Paradigma**: Programação orientada a objetos com injeção de dependência
- **Padrão Arquitetural**: MVC (Model-View-Controller) com camadas de serviço
- **Tipo de API**: REST com documentação Swagger/OpenAPI

### 1.3 Contexto Acadêmico
Para um TCC, este projeto aborda múltiplos conceitos fundamentais de engenharia de software:
- Arquitetura de software escalável
- Segurança em aplicações web
- Persistência de dados relacional
- Validação e tratamento de erros
- Testing e qualidade de código
- DevOps e containerização

---

## 2. CONCEITOS FUNDAMENTAIS DE ARQUITETURA

### 2.1 Padrão MVC (Model-View-Controller)

#### Definição e Aplicação
O projeto implementa o padrão MVC distribuído em dois sistemas:

**Backend (Server-side MVC)**
```
REQUEST → CONTROLLER → SERVICE → PRISMA (ORM) → DATABASE
           ↑                                        ↓
           └─────────────── RESPONSE ───────────────┘
```

- **Controllers**: Camada de apresentação que recebe requisições HTTP
  - Endpoint: `/aulas` → `AulasController`
  - Responsabilidades: parsing de entrada, delegação para serviço, formatação de resposta
  
- **Services**: Camada de lógica de negócio
  - Exemplo: `AulasService` contém a lógica para criar, atualizar e gerenciar aulas
  - Interage com Prisma para persistência
  - Implementa validações de negócio

- **Models**: Representação de dados no banco através do Prisma
  - Exemplo: `Lesson`, `Attendance`, `User` (definidos em `schema.prisma`)
  - Propriedades e relacionamentos definidos declarativamente

**Frontend (Single Page Application)**
```
USER INTERACTION → COMPONENT → CONTEXT/HOOK → SERVICE → FETCH/AXIOS → API
                                                                         ↓
                   STATE UPDATE ← RESPONSE ←──────────────────────────┘
```

- **Components** (View layer em React)
- **Contexts e Custom Hooks** (Controller/State Management layer)
- **Services** (API Communication layer)

#### Por que MVC é apropriado?
1. **Separação de responsabilidades**: Fácil manutenção e teste
2. **Escalabilidade**: Adicionar novas entidades é simples (novo module + controller + service)
3. **Reusabilidade**: Serviços podem ser compartilhados entre múltiplos controllers
4. **Testabilidade**: Cada camada pode ser testada isoladamente

### 2.2 Arquitetura em Camadas

O projeto organiza-se em **4 camadas principais**:

```
┌─────────────────────────────────────────┐
│   PRESENTATION LAYER (Frontend + API)   │ React + Controllers
├─────────────────────────────────────────┤
│   APPLICATION LAYER (Business Logic)    │ Services + DTOs
├─────────────────────────────────────────┤
│   PERSISTENCE LAYER (Data Access)       │ Prisma ORM
├─────────────────────────────────────────┤
│   DATABASE LAYER (Data Storage)         │ PostgreSQL
└─────────────────────────────────────────┘
```

#### Benefícios da Arquitetura em Camadas
| Benefício | Implementação no projeto |
|-----------|--------------------------|
| **Independência de tecnologia** | Trocar PostgreSQL por outro BD sem impactar lógica |
| **Testabilidade** | Services podem ser testados sem HTTP |
| **Manutenibilidade** | Mudanças isoladas em cada camada |
| **Escalabilidade** | Cada camada pode escalar independentemente |

### 2.3 Modularidade no NestJS

O NestJS organiza funcionalidades em **Módulos** que encapsulam:
- Controllers
- Services
- Providers (Injeção de Dependência)
- Imports/Exports

Exemplo da estrutura:

```typescript
// auth.module.ts - Módulo de Autenticação
@Module({
  imports: [PrismaModule, PassportModule, JwtModule.registerAsync(...)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

// turmas.module.ts - Módulo de Turmas
@Module({
  imports: [PrismaModule],
  controllers: [TurmasController],
  providers: [TurmasService],
})
export class TurmasModule {}

// app.module.ts - Agregação de todos os módulos
@Module({
  imports: [
    AuthModule,
    TurmasModule,
    AulasModule,
    PresencasModule,
    // ... outros módulos
  ],
})
export class AppModule {}
```

**Vantagens:**
- Coesão temática: `TurmasModule` contém tudo relacionado a turmas
- Encapsulamento: Módulos exportam apenas o necessário
- Testabilidade: Módulos podem ser importados em testes isoladamente
- Escalabilidade: Adicionar um novo módulo não afeta os existentes

---

## 3. CONCEITOS DE SEGURANÇA

### 3.1 Autenticação com JWT (JSON Web Tokens)

#### O que é JWT?
JWT é um padrão de token criptografado que contém informações do usuário, permitindo autenticação stateless.

#### Fluxo de Autenticação no Projeto

```
┌──────────────┐
│  User Login  │
│ (email/pass) │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ POST /auth/login                     │
│ → AuthController.login()             │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.validateUser()           │
│ 1. Busca usuário por email           │
│ 2. Compara senha com bcrypt.compare()│
│ 3. Retorna usuário se válido         │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.login()                  │
│ 1. Gera JWT token (access_token)     │
│ 2. Cria refresh_token no banco       │
│ 3. Retorna ambos ao cliente          │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Client recebe:                       │
│ {                                    │
│   access_token: "eyJhbG...",         │
│   refresh_token: "abc123xyz...",     │
│   user: { id, email, roles }         │
│ }                                    │
└──────────────────────────────────────┘
```

#### Implementação Técnica

**1. Geração de Token (auth.service.ts)**
```typescript
const payload = { email: user.email, sub: user.id, roles };
const accessToken = this.jwtService.sign(payload, {
  expiresIn: '15m' // Curta validade
});
```

**2. Armazenamento de Refresh Token**
- Armazenado no banco de dados (tabela `refresh_tokens`)
- Permite renovar access_token sem re-autenticação
- Pode ser revogado para logout

**3. Validação em Requisições (JwtStrategy)**
```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      roles: payload.roles 
    };
  }
}
```

#### Fluxo de Renovação de Token

```
┌─────────────────────────────────────┐
│ Access Token Expirado                │
│ (após 15 minutos)                    │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ POST /auth/refresh                   │
│ Body: { refreshToken: "..." }        │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.refreshAccessToken()     │
│ 1. Verifica se refresh_token é válido│
│ 2. Valida data de expiração          │
│ 3. Valida que não foi revogado       │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Gera novo access_token               │
│ Retorna ao cliente                   │
└──────────────────────────────────────┘
```

#### Vantagens do JWT
| Aspecto | Benefício |
|--------|-----------|
| **Stateless** | Servidor não precisa manter sessão |
| **Escalável** | Funciona bem com múltiplos servidores |
| **Seguro** | Token é criptografado (RS256/HS256) |
| **Portável** | Pode ser usado em diferentes plataformas |

### 3.2 Autorização com Roles e Guards

#### Definição de Roles
O projeto implementa três papéis (roles):

```typescript
enum RoleName {
  USER = "USER",        // Aluno padrão
  PROFESSOR = "PROFESSOR", // Professor/docente
  ADMIN = "ADMIN"       // Administrador
}
```

#### Sistema de Guards e Decoradores

**1. JWT Auth Guard**
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Uso em controllers
@UseGuards(JwtAuthGuard)
@Get('presencas')
findAll() { ... }
```
- Valida se o token JWT é válido
- Executa antes do controller
- Rejeita se token não fornecido ou inválido

**2. Roles Guard**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY, 
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true; // Sem restrição
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Uso em controllers
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

#### Exemplo de Fluxo de Autorização

```typescript
// Controller de Disciplinas
@Controller('disciplinas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisciplinasController {
  
  // Qualquer usuário autenticado pode listar
  @Get()
  findAll() { ... }
  
  // Apenas ADMIN pode criar
  @Post()
  @Roles(RoleName.ADMIN)
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) { ... }
  
  // Apenas ADMIN pode atualizar
  @Patch(':id')
  @Roles(RoleName.ADMIN)
  update(@Param('id') id: string, @Body() updateDisciplinaDto: UpdateDisciplinaDto) { ... }
  
  // Apenas ADMIN pode deletar
  @Delete(':id')
  @Roles(RoleName.ADMIN)
  remove(@Param('id') id: string) { ... }
}
```

### 3.3 Segurança de Senhas

#### Hashing com Bcrypt

```typescript
// Durante o registro
import * as bcrypt from 'bcrypt';

async register(createUsuarioDto: CreateUsuarioDto) {
  const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
  // Salva hashedPassword no banco, nunca a senha em texto plano
}

// Durante o login
async validateUser(email: string, pass: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  const isMatch = await bcrypt.compare(pass, user.password);
  return isMatch ? user : null;
}
```

**Por que bcrypt é seguro?**
- **Salt**: Adiciona aleatoriamente 10 rodadas de hash
- **Irreversível**: Não é possível recuperar a senha original
- **Resistente a força bruta**: Cada hash leva tempo computacional

### 3.4 Tratamento Global de Exceções

O projeto implementa um **Global Exception Filter** para segurança e consistência:

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    
    response.status(status).json({
      statusCode: status,
      message: exception.getResponse(),
      timestamp: new Date().toISOString(),
    });
  }
}

// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

**Benefícios:**
- Padronização de erros
- Não expõe detalhes de implementação
- Logging centralizado
- Tratamento consistente em toda a API

---

## 4. CONCEITOS DE PERSISTÊNCIA DE DADOS

### 4.1 Prisma ORM (Object-Relational Mapping)

#### O que é Prisma?
Prisma é um ORM moderno que fornece:
- Type-safe database access
- Automatic migrations
- Query builder intuitivo
- Documentação automática

#### Definição do Schema

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   Int
  uniqueIdentifier     String         @unique
  name                 String
  email                String         @unique
  password             String
  isActive             Boolean        @default(true)
  roles                UserRole[]
  classes              UserClass[]
  attendances          Attendance[]   @relation("AttendanceUser")
  editedAttendances    Attendance[]   @relation("AttendanceEditor")
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  @@map("usuarios")
}
```

#### Relacionamentos no Prisma

O projeto implementa vários tipos de relacionamentos:

**1. One-to-Many (Um para Muitos)**
```prisma
model Course {
  id          Int
  name        String
  curriculums Curriculum[]  // Um curso tem muitos currículos
}

model Curriculum {
  id        Int
  courseId  Int
  course    Course        @relation(fields: [courseId], references: [id])
  // Um currículo pertence a um curso
}
```

**2. Many-to-Many (Muitos para Muitos)**
```prisma
model UserRole {
  user   User   @relation(fields: [userId], references: [id])
  userId Int
  role   Role   @relation(fields: [roleId], references: [id])
  roleId Int
  @@id([userId, roleId])  // Chave composta
}

// Um usuário pode ter múltiplos papéis
// Um papel pode ser atribuído a múltiplos usuários
```

**3. Self-Relations (Auto-relacionamento)**
```prisma
model Attendance {
  lessonId      Int
  userId        Int
  user          User     @relation("AttendanceUser", fields: [userId], references: [id])
  
  // Auditoria: quem modificou esse registro?
  editedBy      Int?
  editedByUser  User?    @relation("AttendanceEditor", fields: [editedBy], references: [id])
}
```

#### Vantagens do Prisma

| Vantagem | Descrição |
|----------|-----------|
| **Type Safety** | Todas as queries são tipadas em TypeScript |
| **Auto-completion** | IDE fornece sugestões automáticas |
| **Migrations** | Versionamento automático do schema |
| **Query Builder** | API fluente e intuitiva |
| **Relations** | Carregamento automático de relacionamentos |

#### Exemplo de Operações CRUD com Prisma

```typescript
// Create (Criar)
const user = await prisma.user.create({
  data: {
    name: "João Silva",
    email: "joao@example.com",
    password: hashedPassword,
    roles: {
      create: [
        { role: { connect: { id: 1 } } } // Conecta a role existente
      ]
    }
  }
});

// Read (Ler)
const allUsers = await prisma.user.findMany({
  include: { roles: { include: { role: true } } } // Carrega roles associadas
});

const userById = await prisma.user.findUnique({
  where: { id: 1 },
  include: { classes: true, attendances: true }
});

// Update (Atualizar)
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: "João Silva Santos" }
});

// Delete (Deletar)
await prisma.user.delete({
  where: { id: 1 }
});
```

### 4.2 Migrações de Banco de Dados

Prisma gerencia migrações de forma versionada:

```bash
# Criar migração após mudança no schema
npx prisma migrate dev --name "add_avatar_to_user"

# Isso gera uma pasta: migrations/20251023214625_add_avatar_to_user/
```

A estrutura de migrations:

```
prisma/
├── migrations/
│   ├── 20250920214307_init/
│   ├── 20250920223029_add_professor_role/
│   ├── 20250924201429_update_subject_schema/
│   ├── 20251023214625_add_avatar_to_user/
│   └── migration_lock.toml
└── schema.prisma
```

**Benefícios:**
- Histórico completo de mudanças
- Fácil rollback
- Sincronização entre ambientes dev/prod
- Reprodutibilidade

### 4.3 Seed Database (Dados Iniciais)

O projeto inclui um script de seed para popular o banco com dados padrão:

```typescript
// prisma/seed.ts
async function main() {
  // Cria roles
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN }
  });
  
  // Cria usuário admin padrão
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('123456', 10),
      isActive: true,
      uniqueIdentifier: 'admin001'
    }
  });
  
  // Conecta admin ao papel
  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id
    }
  });
}
```

Execução automática:
```bash
npm run seed
```

---

## 5. CONCEITOS DE VALIDAÇÃO E DTO

### 5.1 Data Transfer Objects (DTOs)

DTOs são classes que definem a estrutura esperada de dados de entrada/saída:

```typescript
// create-usuario.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
  
  @IsString()
  uniqueIdentifier: string;
  
  @IsOptional()
  avatarUrl?: string;
}

// Uso em controller
@Post()
create(@Body() createUsuarioDto: CreateUsuarioDto) {
  return this.usuariosService.create(createUsuarioDto);
}
```

### 5.2 Validação com Class-Validator

O projeto usa **class-validator** que aplica validações através de decoradores:

```typescript
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreatePresencaDto {
  @IsInt()
  @IsPositive()
  userId: number;
  
  @IsInt()
  @IsPositive()
  lessonId: number;
  
  @IsBoolean()
  isPresent: boolean;
  
  @IsOptional()
  @IsString()
  justification?: string;
}
```

### 5.3 Transformação Automática com Class-Transformer

```typescript
// No main.ts - configuração global
app.useGlobalPipes(new ValidationPipe({
  transform: true,  // Transforma tipos automaticamente
  transformOptions: {
    enableImplicitConversion: true,
  },
}));

// Exemplo: string "123" é automaticamente convertida para number 123
```

### 5.4 Fluxo de Validação em Requisição

```
┌──────────────────────────────┐
│ Requisição POST /usuarios    │
│ Body (JSON): {               │
│   "name": "João",            │
│   "email": "joao@email.com", │
│   "password": "abc123"       │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Class-Validator avalia      │
│ - @IsEmail() ✓              │
│ - @IsString() ✓             │
│ - @MinLength(6) ✓           │
│ Transformações aplicadas     │
└──────────┬───────────────────┘
           │
    ✓ Válido
           │
           ▼
┌──────────────────────────────┐
│ Chama Controller            │
│ create(createUsuarioDto)    │
└──────────────────────────────┘

           ou ✗ Inválido
           │
           ▼
┌──────────────────────────────┐
│ Retorna erro 400 Bad Request│
│ {                            │
│   statusCode: 400,           │
│   message: [                 │
│     "email must be an email" │
│   ]                          │
│ }                            │
└──────────────────────────────┘
```

---

## 6. CONCEITOS DE API REST

### 6.1 Princípios REST

O projeto segue princípios RESTful (Representational State Transfer):

#### 6.1.1 Recursos e Endpoints

```typescript
// Cada endpoint representa um recurso
GET    /usuarios          // Listar todos os usuários
GET    /usuarios/:id      // Obter usuário específico
POST   /usuarios          // Criar novo usuário
PATCH  /usuarios/:id      // Atualizar usuário
DELETE /usuarios/:id      // Deletar usuário

// Exemplo completo no projeto
GET    /disciplinas       // Listar disciplinas
GET    /disciplinas/:id   // Obter disciplina
POST   /disciplinas       // Criar disciplina
PATCH  /disciplinas/:id   // Atualizar disciplina
DELETE /disciplinas/:id   // Deletar disciplina
```

#### 6.1.2 HTTP Status Codes

O projeto retorna status codes apropriados:

| Código | Significado | Uso |
|--------|-----------|-----|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Erro de validação |
| **401** | Unauthorized | Usuário não autenticado |
| **403** | Forbidden | Usuário sem permissão |
| **404** | Not Found | Recurso não encontrado |
| **500** | Server Error | Erro interno do servidor |

#### 6.1.3 Métodos HTTP

```typescript
@Controller('aulas')
export class AulasController {
  @Get()              // GET  - Recuperar
  findAll() { }
  
  @Get(':id')         // GET  - Recuperar específico
  findOne(@Param('id') id: string) { }
  
  @Post()             // POST - Criar novo
  create(@Body() createAulaDto: CreateAulaDto) { }
  
  @Patch(':id')       // PATCH - Atualizar parcial
  update(
    @Param('id') id: string,
    @Body() updateAulaDto: UpdateAulaDto
  ) { }
  
  @Delete(':id')      // DELETE - Remover
  remove(@Param('id') id: string) { }
}
```

### 6.2 Documentação Automática com Swagger/OpenAPI

O projeto configura automaticamente a documentação da API:

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('API de Gerenciamento de Cursos')
  .setDescription('Documentação da API para o sistema de gerenciamento de cursos.')
  .setVersion('1.0')
  .addBearerAuth()  // Autenticação JWT
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

Acesso: **http://localhost:3000/api**

#### Documentação em Controllers

```typescript
@ApiTags('aulas')
@Controller('aulas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AulasController {
  @Post()
  @ApiOperation({ summary: 'Criar uma nova aula' })
  @ApiResponse({ 
    status: 201, 
    description: 'Aula criada com sucesso',
    type: AulaResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }
}
```

**Benefícios:**
- Documentação sempre sincronizada com código
- Interface interativa para testar endpoints
- Cliente JavaScript gerado automaticamente
- Reduz erros de integração

---

## 7. CONCEITOS DE CONTROLE DE FREQUÊNCIA (DOMÍNIO)

### 7.1 Fluxo de Controle de Aulas

O projeto implementa um sistema completo de controle de aulas:

```typescript
// aulas.service.ts
class AulaState {
  // Estado inicial
  isOpen = false;
  openedAt = null;
  closedAt = null;
  openedBy = null;
}
```

#### 7.1.1 Estados de uma Aula

```
CRIADA ─→ ABERTA ─→ FECHADA
  │         │
  └─────────┴────────→ CANCELADA (optional)
```

| Estado | Operações Permitidas |
|--------|----------------------|
| **CRIADA** | Abrir, Deletar, Editar |
| **ABERTA** | Registrar presença, Fechar |
| **FECHADA** | Visualizar presença, Gerar relatório |

#### 7.1.2 Operações de Controle

```typescript
// Abrir aula
@Post(':id/open')
open(@Param('id') lessonId: number) {
  return this.aulasService.open(lessonId);
}

// Fechar aula
@Post(':id/close')
close(@Param('id') lessonId: number) {
  return this.aulasService.close(lessonId);
}

// Validação: permite registro de presença apenas durante aula aberta
async validateLessonTimeWindow(lessonId: number) {
  const lesson = await this.prisma.lesson.findUnique({
    where: { id: lessonId }
  });
  
  if (!lesson.isOpen) {
    throw new ForbiddenException('Aula não está aberta para presença');
  }
}
```

### 7.2 Sistema de Presença com Auditoria

O projeto implementa auditoria completa de presença:

```prisma
model Attendance {
  lessonId      Int
  userId        Int
  user          User     @relation("AttendanceUser", ...)
  
  isPresent     Boolean
  justification String?
  
  // AUDITORIA - Rastreamento de modificações
  editedBy      Int?
  editedByUser  User?    @relation("AttendanceEditor", ...)
  editReason    String?
  editedAt      DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### 7.2.1 Fluxo de Registro de Presença

```
┌─────────────────────────────────────────┐
│ POST /presencas                         │
│ {                                       │
│   "lessonId": 5,                        │
│   "userId": 12,                         │
│   "isPresent": true,                    │
│   "attendancePassword": "senha123"      │
│ }                                       │
└──────┬────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ PresencasService.create()               │
│ 1. Valida se usuário está na turma      │
│ 2. Valida se aula está aberta           │
│ 3. Valida senha de presença (se aluno)  │
│ 4. Cria registro na tabela presencas    │
└──────┬────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Attendance criada com:                   │
│ - lessonId, userId, isPresent           │
│ - createdAt = agora                     │
│ - editedBy, editReason = null (inicial) │
└─────────────────────────────────────────┘
```

#### 7.2.2 Atualização com Auditoria

```typescript
// Quando professor/admin modifica presença
async update(id: string, updatePresencaDto: UpdatePresencaDto, userId: number) {
  const [lessonId, userIdStr] = id.split('-');
  
  const updated = await this.prisma.attendance.update({
    where: { 
      lessonId_userId: {
        lessonId: parseInt(lessonId),
        userId: parseInt(userIdStr)
      }
    },
    data: {
      isPresent: updatePresencaDto.isPresent,
      justification: updatePresencaDto.justification,
      // Auditoria
      editedBy: userId,           // Quem fez a mudança
      editReason: updatePresencaDto.editReason, // Por quê
      editedAt: new Date()        // Quando
    }
  });
  
  return updated;
}
```

**Benefícios da Auditoria:**
- Rastreamento completo de modificações
- Compliance (LGPD, regulamentações acadêmicas)
- Resolução de disputas
- Análise de padrões

### 7.3 Segurança de Presença

O projeto implementa múltiplas camadas de segurança:

#### 7.3.1 Senha de Presença

```typescript
// Aula criada com senha opcional
const lesson = await prisma.lesson.create({
  data: {
    classId,
    date,
    startTime,
    endTime,
    attendancePassword: "senha123456" // Gerada randomicamente
  }
});

// Aluno deve fornecer senha para registrar presença
async validateAttendancePassword(lessonId: number, password: string) {
  const lesson = await this.prisma.lesson.findUnique({
    where: { id: lessonId }
  });
  
  if (lesson.attendancePassword !== password) {
    throw new ForbiddenException('Senha de presença incorreta');
  }
}
```

#### 7.3.2 Validação de Janela Temporal

```typescript
// Presença só pode ser registrada durante aula
async validateLessonTimeWindow(lessonId: number) {
  const lesson = await this.prisma.lesson.findUnique({
    where: { id: lessonId }
  });
  
  const now = new Date();
  if (now < lesson.startTime || now > lesson.endTime) {
    throw new ForbiddenException('Fora do horário permitido');
  }
}
```

#### 7.3.3 Validação de Envolvimento

```typescript
// Usuário só pode registrar presença em turmas que está enrollado
async validateUserInClass(userId: number, lessonId: number) {
  const userClass = await this.prisma.userClass.findFirst({
    where: {
      userId,
      class: { lessons: { some: { id: lessonId } } }
    }
  });
  
  if (!userClass) {
    throw new ForbiddenException('Usuário não está enrollado nesta turma');
  }
}
```

---

## 8. CONCEITOS DE BANCO DE DADOS

### 8.1 Modelagem Relacional

O projeto utiliza um banco de dados relacional (PostgreSQL) com as seguintes entidades principais:

```
┌─────────────┐
│   USUARIOS  │ (usuários do sistema)
└─────┬───────┘
      │ 1:N
      ▼
┌─────────────────┐
│ USUARIOS_CARGOS │ (relacionamento muitos-para-muitos)
└─────┬───────────┘
      │ N:M
      ▼
┌─────────────┐
│   CARGOS    │ (papéis: USER, PROFESSOR, ADMIN)
└─────────────┘

┌──────────────┐
│   CURSOS     │ (programas acadêmicos)
└──────┬───────┘
       │ 1:N
       ▼
┌────────────────────┐
│ GRADES_CURRICULARES│ (currículo de cursos)
└────────┬───────────┘
         │ 1:N
         ▼
┌──────────────────────────┐
│ CURRICULO_DISCIPLINAS   │ (disciplinas no currículo)
└────────┬─────────────────┘
         │ N:1
         ▼
┌─────────────────┐
│  DISCIPLINAS    │ (matérias/assuntos)
└────────┬────────┘
         │ 1:N
         ▼
┌──────────────────┐
│    TURMAS        │ (instâncias de disciplinas)
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│    AULAS         │ (sessões de aula)
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│   PRESENCAS      │ (registros de frequência)
└──────────────────┘
```

### 8.2 Integridade Referencial

O banco garante integridade através de chaves estrangeiras:

```sql
-- Exemplo: Uma aula sempre deve pertencer a uma turma válida
ALTER TABLE aulas ADD CONSTRAINT fk_aula_turma
  FOREIGN KEY (classId) REFERENCES turmas(id)
  ON DELETE CASCADE;

-- Se turma é deletada, suas aulas são deletadas automaticamente
```

### 8.3 Tipos de Dados

O projeto usa tipos apropriados para cada campo:

| Campo | Tipo | Razão |
|-------|------|-------|
| `id` | INT PRIMARY KEY | Identificação única |
| `email` | VARCHAR UNIQUE | Contato de usuário, deve ser único |
| `password` | VARCHAR | Hash bcrypt (~60 chars) |
| `isPresent` | BOOLEAN | Presença é sim/não |
| `date` | DATE | Apenas data, sem hora |
| `startTime` | DATETIME | Data e hora precisos |
| `createdAt` | TIMESTAMP | Rastreamento de criação |
| `updatedAt` | TIMESTAMP | Rastreamento de atualização |

### 8.4 Índices para Performance

```prisma
model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique  // Índice único para buscas rápidas
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId])  // Índice em userId para JOINs rápidos
}
```

---

## 9. CONCEITOS DE FRONTEND E SPA

### 9.1 Single Page Application (SPA) com React

O frontend é uma SPA que executa no navegador:

```
┌────────────────────────────────────┐
│         BROWSER (Client)            │
│                                     │
│ ┌────────────────────────────────┐ │
│ │ React Components               │ │
│ │ - LoginPage                    │ │
│ │ - DashboardPage                │ │
│ │ - TurmasPage                   │ │
│ │ - AulasPage                    │ │
│ └────────────────────────────────┘ │
│                │                    │
│                ▼                    │
│ ┌────────────────────────────────┐ │
│ │ State Management               │ │
│ │ - AuthContext                  │ │
│ │ - React Query (caching)        │ │
│ └────────────────────────────────┘ │
│                │                    │
│                ▼                    │
│ ┌────────────────────────────────┐ │
│ │ HTTP Client (Axios)            │ │
│ └──────────────────┬─────────────┘ │
└───────────────────┼────────────────┘
                    │
         HTTP (REST/JSON)
                    │
                    ▼
         ┌──────────────────┐
         │  Backend API     │
         │  (NestJS)        │
         └──────────────────┘
```

#### 9.1.1 Vantagens da SPA

| Vantagem | Descrição |
|----------|-----------|
| **Reatividade** | UI atualiza imediatamente sem recarregar página |
| **Performance** | Carrega apenas dados (JSON), não HTML inteiro |
| **Experiência** | Sensação de aplicação desktop em navegador |
| **Separação** | Frontend e backend completamente independentes |

### 9.2 TypeScript no Frontend

O projeto usa TypeScript para type-safety em React:

```typescript
// services/api.ts
import axios, { AxiosInstance } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles: string[];
  };
}

interface ApiClient {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getProfile(): Promise<UserProfile>;
}

// components/LoginForm.tsx
interface LoginFormProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  // Implementação
};
```

### 9.3 Gerenciamento de Estado de Autenticação

```typescript
// contexts/AuthContext.tsx
interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  
  // Gerencia autenticação em nível global
  
  return (
    <AuthContext.Provider value={{...}}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 9.4 HTTP Interceptors para JWT

```typescript
// services/axiosInstance.ts
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

// Request interceptor - adiciona token JWT a toda requisição
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - renova token se expirado
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirou, tenta renovar
      const refreshToken = localStorage.getItem('refresh_token');
      const newTokens = await refreshAccessToken(refreshToken);
      localStorage.setItem('access_token', newTokens.access_token);
      // Retenta requisição original
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 9.5 React Router para Navegação

```typescript
// Rotas protegidas baseadas em autenticação
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />
  
  {/* Admin-only routes */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
  
  {/* Lazy-loaded routes */}
  <Route
    path="/statistics"
    element={
      <Suspense fallback={<LoadingPage />}>
        <StatisticsPage />
      </Suspense>
    }
  />
</Routes>
```

### 9.6 Lazy Loading e Code Splitting

```typescript
// Componentes carregados sob demanda
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const CoursesListPage = lazy(() => import('./pages/CoursesListPage'));

// Reduz bundle size inicial
// ProfilePage só é carregado quando acessado
```

---

## 10. CONCEITOS DE TESTING

### 10.1 Testes Unitários com Jest

O projeto inclui configuração de testes unitários:

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UsuariosService>;
  let mockPrisma: Partial<PrismaService>;
  
  beforeEach(() => {
    // Setup mocks
    mockUserService = {
      create: jest.fn()
    };
    mockPrisma = {
      user: {
        findUnique: jest.fn()
      }
    };
    
    service = new AuthService(
      mockUserService as UsuariosService,
      mockPrisma as PrismaService,
      jwtService,
      configService
    );
  });
  
  it('should validate user with correct password', async () => {
    const result = await service.validateUser('test@test.com', 'password');
    expect(result).toBeDefined();
  });
  
  it('should throw UnauthorizedException with wrong password', async () => {
    await expect(
      service.validateUser('test@test.com', 'wrong')
    ).rejects.toThrow(UnauthorizedException);
  });
});
```

### 10.2 Testes E2E com Supertest

Testes que exercitam a aplicação completa:

```typescript
// app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('should login and return tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: '123456'
      })
      .expect(200);
    
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body.user.email).toBe('admin@example.com');
  });
  
  it('should list classes with valid token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: '123456' });
    
    const response = await request(app.getHttpServer())
      .get('/turmas')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### 10.3 Cobertura de Testes

O projeto foi configurado com:

```bash
npm run test:cov  # Executa testes com cobertura
```

Gera relatório em `coverage/`:
- `lcov-report/index.html` - Visualização interativa
- `coverage-final.json` - Dados de cobertura
- `clover.xml` - Formato compatível com CI/CD

---

## 11. CONCEITOS DE DEVOPS E CONTAINERIZAÇÃO

### 11.1 Docker e Containerização

O projeto utiliza Docker para padronização de ambiente:

```dockerfile
# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm ci --only=production

# Copia código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Executa aplicação
CMD ["npm", "run", "start:prod"]

EXPOSE 3000
```

**Vantagens:**
- Mesmo ambiente dev/prod
- Isolamento de dependências
- Fácil deploy em qualquer servidor
- Reprodutibilidade

### 11.2 Docker Compose para Orquestração

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["3000:3000"]
    depends_on: [db]
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/inf_att_db
  
  frontend:
    build: ./frontend
    ports: ["8080:5173"]
  
  db:
    image: postgres:18
    environment:
      POSTGRES_DB: inf_att_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:  # Persistência de dados do banco
```

**Comandos principais:**
```bash
docker-compose up              # Inicia todos os serviços
docker-compose up --build      # Reconstrói e inicia
docker-compose down            # Para todos os serviços
docker-compose logs -f backend # Vê logs do backend
```

### 11.3 Ambiente de Desenvolvimento vs Produção

#### Desenvolvimento
```bash
# .env.local
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5433/inf_att_db
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

#### Produção
```bash
# Variáveis do sistema (não em arquivo)
NODE_ENV=production
DATABASE_URL=[URL segura da produção]
JWT_SECRET=[secret aleatória forte]
```

---

## 12. CONCEITOS DE QUALIDADE DE CÓDIGO

### 12.1 ESLint e Prettier

Padronização de código:

```javascript
// eslint.config.mjs
export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'semi': ['error', 'always']
    }
  }
]);
```

### 12.2 Princípios SOLID

O projeto implementa princípios SOLID:

#### Single Responsibility Principle (SRP)
```typescript
// Cada classe tem uma responsabilidade
class UsuariosService {
  // Responsável apenas por operações de usuário
  create(dto: CreateUsuarioDto) { }
  findById(id: number) { }
  update(id: number, dto: UpdateUsuarioDto) { }
}

class AuthService {
  // Responsável apenas por autenticação
  login(dto: LoginDto) { }
  validateUser(email: string, password: string) { }
  refreshToken(token: string) { }
}
```

#### Open/Closed Principle (OCP)
```typescript
// Aberto para extensão, fechado para modificação
export interface RoleGuardStrategy {
  canActivate(user: User, requiredRoles: Role[]): boolean;
}

class AdminRoleGuard implements RoleGuardStrategy {
  canActivate(user: User, requiredRoles: Role[]): boolean {
    return user.roles.includes(RoleName.ADMIN);
  }
}

// Adicione novo tipo de guarda sem modificar código existente
```

#### Dependency Injection (DI)
```typescript
// Inversão de controle - dependências injetadas
@Injectable()
export class AulasService {
  constructor(
    private readonly prisma: PrismaService,  // Injetado
    private readonly logger: Logger          // Injetado
  ) {}
  
  // Não cria instâncias diretamente
  // NestJS gerencia ciclo de vida
}
```

---

## 13. ANÁLISE CRÍTICA: PONTOS FORTES E MELHORIAS

### 13.1 Pontos Fortes

✅ **Arquitetura Clara e Organizada**
- Separação bem definida entre camadas
- Módulos coesos e independentes
- Fácil de navegar e entender

✅ **Segurança Robusta**
- Autenticação JWT com refresh tokens
- Autorização baseada em roles
- Senhas hasheadas com bcrypt
- Validação em múltiplas camadas

✅ **Persistência Bem Modelada**
- Schema relacional correto
- Migrações versionadas
- Relacionamentos apropriados
- Auditoria de dados

✅ **Boas Práticas Modernas**
- TypeScript para type-safety
- DTOs para validação
- CORS configurado
- Documentação automática (Swagger)
- Testing framework configurado

✅ **Containerização**
- Docker setup completo
- Docker Compose para orquestração
- Ambiente reprodutível

### 13.2 Pontos de Melhoria

⚠️ **Tratamento de Erros Mais Específico**
- Criar exceções customizadas por domínio
- Melhorar mensagens de erro para o cliente

⚠️ **Logging Estruturado**
- Implementar logger centralizado (Winston, Pino)
- Logar em diferentes níveis (debug, info, warn, error)

⚠️ **Rate Limiting**
- Proteger endpoints de brute force
- Implementar throttling

⚠️ **Cache**
- Implementar Redis para dados frequentemente acessados
- Cache de cursos, disciplinas

⚠️ **Validação de Negócio Mais Rigorosa**
- Validar se presença já foi registrada (idempotência)
- Validar duplicação de dados

⚠️ **Observabilidade**
- Health checks mais detalhados
- Métricas de performance
- Rastreamento distribuído (distributed tracing)

⚠️ **Testes de Integração**
- Mais testes E2E
- Testes de fluxo completo (login → criar turma → registrar presença)

---

## 14. CONCEITOS RELACIONADOS PARA TCC

### 14.1 Tópicos que Pueden Abordar

1. **Padrões de Design**
   - MVC em aplicações modernas
   - Injeção de Dependência
   - Strategy Pattern (validações)

2. **Segurança em Aplicações Web**
   - Autenticação stateless com JWT
   - CORS e CSRF
   - Validação e sanitização
   - Hashing de senhas

3. **Arquitetura de Software**
   - Separação de responsabilidades
   - Escalabilidade horizontal
   - Resiliência e tolerância a falhas

4. **Banco de Dados**
   - Modelagem relacional
   - Migrações e versionamento
   - Índices e performance
   - Integridade referencial

5. **API REST**
   - Princípios RESTful
   - Documentação automática
   - Versionamento de API
   - Rate limiting

6. **DevOps**
   - Containerização com Docker
   - Orquestração com Docker Compose
   - CI/CD pipelines
   - Infrastructure as Code

7. **Testing**
   - Testes unitários
   - Testes de integração
   - Testes E2E
   - Cobertura de código

---

## 15. CONCLUSÃO

O projeto **inf_att** é uma aplicação bem estruturada que demonstra compreensão sólida de:

✅ Engenharia de Software moderna
✅ Padrões arquiteturais comprovados
✅ Segurança em aplicações web
✅ Persistência e modelagem de dados
✅ Desenvolvimento full-stack

**Recomendações para TCC:**

1. **Documentação**: Expanda a documentação técnica com diagramas UML
2. **Testes**: Aumentar cobertura de testes (mire em 80%+)
3. **Performance**: Adicionar benchmarks e análise de performance
4. **Escalabilidade**: Documentar estratégias de escalabilidade
5. **Manutenibilidade**: Adicionar mais comentários e exemplos
6. **Observabilidade**: Implementar logging e monitoramento

Este projeto é excelente base para um TCC em Engenharia de Software, oferecendo muitos tópicos para exploração e análise crítica.

---

**Última atualização**: 17 de novembro de 2025
**Versão da Análise**: 1.0
**Escopo**: Conceitos e Fundamentos Completos
