"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/users/routes.ts
var routes_exports = {};
__export(routes_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/users/fetch.ts
var import_zod2 = require("zod");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string().optional(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query", "info", "warn", "error"] : []
});

// src/repositories/prisma/prisma-user-repository.ts
var PrismaUserRepository = class {
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        password: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        studentId: true
      }
    });
  }
  async searchMany(role, page) {
    let pageSize = 20;
    const totalItems = await prisma.user.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        role
      },
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        studentId: true
      }
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: users
    };
  }
  async create(data) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        employeeId: data.employeeId,
        studentId: data.studentId,
        lastLogin: /* @__PURE__ */ new Date(),
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async updateLoginAttempt(id, attempts) {
    await prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async resetUserPassword(id, password) {
    await prisma.user.update({
      where: { id },
      data: {
        password,
        loginAttempt: 0,
        isBlocked: false,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async blockUser(id, status) {
    await prisma.user.update({
      where: { id },
      data: {
        isBlocked: Boolean(status),
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async logAccess(userId, status) {
    await prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/use-cases/user/fetch-user.ts
var FetchUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    role,
    page
  }) {
    const users = await this.usersRepository.searchMany(
      role,
      page
    );
    return {
      users
    };
  }
};

// src/use-cases/factories/make-fetch-users-use-case.ts
function makeFetchUsersUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const fetchUserUseCase = new FetchUserUseCase(prismaUserRepository);
  return fetchUserUseCase;
}

// src/http/controllers/users/fetch.ts
var import_client2 = require("@prisma/client");
async function fetch(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    role: import_zod2.z.nativeEnum(import_client2.Role).default("STUDENT"),
    page: import_zod2.z.coerce.number().int().positive().optional()
  });
  const { role, page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchUserUseCase = makeFetchUsersUseCase();
    let users = await fetchUserUseCase.execute({
      role,
      page
    });
    return reply.status(200).send(users);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/errors/user-is-invalid-error.ts
var UserInvalidError = class extends Error {
  constructor() {
    super("User is invalid.");
  }
};

// src/use-cases/user/block-user.ts
var BlockUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    status
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    await this.usersRepository.blockUser(findUser.id, status);
  }
};

// src/use-cases/factories/make-block-user-use-case.ts
function makeBlockUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const blockUserUseCase = new BlockUserUseCase(prismaUserRepository);
  return blockUserUseCase;
}

// src/http/controllers/users/block.ts
var import_zod3 = require("zod");
async function blockUser(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    status: import_zod3.z.boolean(),
    email: import_zod3.z.string()
  });
  const { email, status } = registerBodySchema.parse(request.body);
  try {
    const blockUserUseCase = makeBlockUserUseCase();
    await blockUserUseCase.execute({
      email,
      status
    });
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/user/reset-user-password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var ResetUserPasswordUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    let newHashedPassword = await import_bcryptjs.default.hash(password, 10);
    await this.usersRepository.resetUserPassword(findUser.id, newHashedPassword);
  }
};

// src/use-cases/factories/make-reset-user-password-use-case.ts
function makeResetUserPasswordUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const resetUserPasswordUseCase = new ResetUserPasswordUseCase(prismaUserRepository);
  return resetUserPasswordUseCase;
}

// src/http/controllers/users/reset-password.ts
var import_zod4 = require("zod");
async function resetPassword(request, reply) {
  const registerBodySchema = import_zod4.z.object({
    email: import_zod4.z.string(),
    password: import_zod4.z.string().default("123456")
  });
  const { email, password } = registerBodySchema.parse(request.body);
  try {
    const resetUserPasswordUseCase = makeResetUserPasswordUseCase();
    await resetUserPasswordUseCase.execute({
      email,
      password
    });
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/errors/user-not-found.ts
var UserNotFoundError = class extends Error {
  constructor() {
    super("User not found.");
  }
};

// src/use-cases/user/get-user.ts
var GetUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email
  }) {
    const user = await this.usersRepository.findByEmail(
      email
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    delete user.password;
    return {
      user
    };
  }
};

// src/use-cases/factories/make-get-user-use-case.ts
function makeGetUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const getUserUseCase = new GetUserUseCase(prismaUserRepository);
  return getUserUseCase;
}

// src/http/controllers/users/get.ts
var import_zod5 = require("zod");
async function get(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    email: import_zod5.z.string()
  });
  const { email } = registerBodySchema.parse(request.query);
  try {
    const getUserUseCase = makeGetUserUseCase();
    const user = await getUserUseCase.execute({
      email
    });
    return reply.send(user);
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/users/routes.ts
async function usersRoutes(app) {
  app.get("/users", fetch);
  app.get("/user", get);
  app.post("/users/block", blockUser);
  app.post("/users/reset-password", resetPassword);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
