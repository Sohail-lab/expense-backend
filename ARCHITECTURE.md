# Layered Architecture Refactor

## Overview

This codebase has been refactored from a simple routes + queries pattern to a **layered architecture** following industry best practices.

## Architecture Layers

### 1. **Presentation Layer** (`src/presentation/`)

**Responsibility**: Handle HTTP requests and responses

- **Controllers**: Map HTTP endpoints to service methods
  - `AuthController` - Login, logout, Google OAuth
  - `UserController` - User CRUD operations
  - `GroupController` - Group management
  - `TransactionController` - Transaction operations
  - `PaymentController` - Payment queries

- **Routes**: Define API endpoints and mount controllers
  - `authRoutes` - `/auth` endpoints
  - `userRoutes` - `/users` endpoints
  - `groupRoutes` - `/groups` endpoints
  - `transactionRoutes` - `/transactions` endpoints
  - `paymentRoutes` - `/payments` endpoints
  - `testRoutes` - `/test` endpoints (admin only)

**Key Point**: Controllers ONLY handle HTTP concerns (request parsing, response formatting, status codes). All business logic is delegated to services.

### 2. **Application Layer** (`src/application/services/`)

**Responsibility**: Contain business logic and orchestration

- **Services**: Implement use cases and business rules
  - `AuthService` - Login/logout/OAuth logic
  - `UserService` - User creation, validation, deletion
  - `GroupService` - Group creation, joining, code generation
  - `TransactionService` - Transaction creation with validation
  - `PaymentService` - Payment queries

**Key Point**: Services are:
- Independent of HTTP (testable without mocking Express)
- Reusable across different interfaces (API, CLI, etc.)
- Contain input validation and business rules
- Coordinate between multiple repositories if needed

### 3. **Infrastructure Layer** (`src/infrastructure/`)

**Responsibility**: Handle external systems and technical concerns

- **Database**: (`src/infrastructure/database/`)
  - `db.ts` - MySQL connection pool setup
  - `helper.ts` - Query execution utilities, logging, code generation

- **Middleware**: (`src/infrastructure/middleware/`)
  - `authMiddleware.ts` - Session validation, user extraction

**Key Point**: Infrastructure code is:
- Isolated from business logic
- Easy to replace (swap MySQL for PostgreSQL, etc.)
- Focused on technical implementation details

### 4. **Domain Layer** (`src/domain/`)

**Responsibility**: Define domain types and entities

- Types and interfaces representing business concepts
- `TxnData` - Transaction structure
- Future: Domain models with business methods

---

## Data Flow Example: Create User

```
HTTP POST /users
    ↓
[Presentation] UserController.createUser()
    ↓
[Application] UserService.createUser()
    ├─ Validate email format
    ├─ Check if email already exists
    └─ Hash password (future)
    ↓
[Infrastructure] executeTransaction()
    ↓
[Database] MySQL INSERT
```

## Testing Benefits

### Before (Routes + Queries)
```typescript
// Hard to test: requires mocking Express AND database
router.post('/', async (req, res) => {
    const result = await createUser(req.body);
    res.json(result);
});
```

### After (Layered)
```typescript
// Easy to test: just mock the database layer
const service = new UserService();
const result = await service.createUser({ name, email, password });
assert(result.message === 'success');
```

## Adding New Features

Example: Add an "Update Group" endpoint

1. **Add to GroupService** (business logic):
   ```typescript
   async updateGroup(groupId: number, data: UpdateGroupDTO) {
       // validation
       // update logic
   }
   ```

2. **Add to GroupController** (HTTP handler):
   ```typescript
   async updateGroup(req: Request, res: Response) {
       const result = await this.groupService.updateGroup(id, req.body);
       res.json(result);
   }
   ```

3. **Wire in routes** (`groupRoutes.ts`):
   ```typescript
   router.patch('/:id', authenticate, (req, res) => 
       groupController.updateGroup(req, res)
   );
   ```

## Migration Notes

### What Changed

- Old `routes/` → Now split into `src/presentation/routes/` + `src/application/services/`
- Old `queries/` → Logic merged into services, simple DB calls in helper
- Old `helpers/` → Moved to `src/infrastructure/database/helper.ts`
- Old `middleware/` → Moved to `src/infrastructure/middleware/`
- Old `db/` → Moved to `src/infrastructure/database/`

### What Stayed the Same

- Database schema (unchanged)
- Environment variables (unchanged)
- API contracts (endpoints work identically)
- Dependencies (Express, MySQL, etc.)

### Breaking Changes

**NONE** — The API remains fully compatible. This is a pure internal refactor.

---

## Next Steps

1. **Add Repository Pattern** (optional):
   - Create interfaces for database operations
   - Abstract MySQL implementation details
   - Easier to swap databases later

2. **Add Dependency Injection**:
   - Use `inversifyjs` or `tsyringe`
   - Reduce manual wiring in controllers
   - Enable factory pattern for testing

3. **Add Unit Tests**:
   - Mock services in controller tests
   - Mock database in service tests
   - Integration tests for full flows

4. **Add DTOs** (Data Transfer Objects):
   - Validate request/response shapes
   - Decouple API contract from database schema

5. **Move to Full Clean Architecture**:
   - Add explicit use cases (one per user action)
   - Add value objects for domain concepts
   - Add error handling boundary (application layer)

---

## File Structure

```
expense-backend/
├── src/
│   ├── application/
│   │   └── services/              ← Business logic
│   │       ├── AuthService.ts
│   │       ├── UserService.ts
│   │       ├── GroupService.ts
│   │       ├── TransactionService.ts
│   │       └── PaymentService.ts
│   ├── domain/
│   │   └── types/                 ← Domain types
│   │       └── txnData.ts
│   ├── infrastructure/
│   │   ├── database/              ← DB & utilities
│   │   │   ├── db.ts
│   │   │   └── helper.ts
│   │   └── middleware/            ← Express middleware
│   │       └── authMiddleware.ts
│   └── presentation/
│       ├── controllers/           ← HTTP handlers
│       │   ├── AuthController.ts
│       │   ├── UserController.ts
│       │   ├── GroupController.ts
│       │   ├── TransactionController.ts
│       │   └── PaymentController.ts
│       └── routes/                ← Route definitions
│           ├── authRoutes.ts
│           ├── userRoutes.ts
│           ├── groupRoutes.ts
│           ├── transactionRoutes.ts
│           ├── paymentRoutes.ts
│           ├── testRoutes.ts
│           └── index.ts
├── index.ts                       ← App entry point
├── package.json
└── ...
```
