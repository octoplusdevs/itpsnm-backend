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

// src/http/controllers/auth/routes.ts
var routes_exports = {};
__export(routes_exports, {
  authRoutes: () => authRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/auth/login.ts
var import_zod = require("zod");

// src/use-cases/authenticate/authenticate.ts
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var LoginUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
    this.jwtSecret = process.env.JWT_SECRET;
    // Use uma variável de ambiente para o segredo
    this.ATTEMPT_LIMIT = 5;
  }
  async execute({ email, password }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    const passwordMatches = await import_bcryptjs.default.compare(password, user.password);
    if (!passwordMatches) {
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);
      await this.usersRepository.logAccess(user.id, import_client.AccessStatus.FAILURE);
      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id);
        return {
          success: false,
          message: "Account blocked due to multiple failed login attempts."
        };
      }
      return {
        success: false,
        message: "Invalid credentials."
      };
    }
    if (user.isBlocked) {
      return {
        success: false,
        message: "Account is blocked. Please contact support."
      };
    }
    await this.usersRepository.updateLoginAttempt(user.id, 0);
    await this.usersRepository.logAccess(user.id, import_client.AccessStatus.SUCCESS);
    const token = import_jsonwebtoken.default.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: "1h" }
      // Token expira em 1 hora
    );
    return {
      success: true,
      message: "Login successful",
      userId: user.id,
      role: user.role,
      token
    };
  }
};

// src/repositories/prisma/prisma-user-repository.ts
var import_client2 = require("@prisma/client");
var PrismaUserRepository = class {
  constructor() {
    this.prisma = new import_client2.PrismaClient();
  }
  async findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date(),
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
        // EmployeeId and StudentId should be handled if needed
      }
    });
  }
  async updateLoginAttempt(id, attempts) {
    await this.prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async blockUser(id) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isBlocked: true,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async logAccess(userId, status) {
    await this.prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/http/controllers/auth/login.ts
async function loginController(request, reply) {
  const loginSchema = import_zod.z.object({
    email: import_zod.z.string().email(),
    password: import_zod.z.string().min(6)
    // Definindo uma mínima de 6 caracteres para a senha
  });
  const { email, password } = loginSchema.parse(request.body);
  const usersRepository = new PrismaUserRepository();
  const loginUseCase = new LoginUseCase(usersRepository);
  try {
    const result = await loginUseCase.execute({ email, password });
    if (result.success) {
      return reply.status(200).send({
        success: result.success,
        message: result.message,
        userId: result.userId,
        role: result.role,
        token: result.token
      });
    } else {
      return reply.status(400).send({
        success: result.success,
        message: result.message
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// src/http/middlewares/verify-user-role.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function accessControlMiddleware(requiredRole) {
  return async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ message: "Unauthorized: No token provided" });
      }
      const token = authHeader.replace("Bearer ", "");
      const secretKey = process.env.JWT_SECRET;
      let decodedToken;
      try {
        decodedToken = (0, import_jsonwebtoken2.verify)(token, secretKey);
      } catch (error) {
        return reply.status(401).send({ message: "Unauthorized: Invalid token" });
      }
      const { userId, role } = decodedToken;
      const usersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);
      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: "Unauthorized: User is blocked or inactive" });
      }
      if (user.role !== requiredRole) {
        return reply.status(403).send({ message: "Forbidden: Access denied" });
      }
      request.user = user;
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  };
}

// src/http/controllers/auth/routes.ts
var import_client3 = require("@prisma/client");

// src/http/controllers/auth/register.ts
var import_zod2 = require("zod");

// src/use-cases/authenticate/register.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken3 = require("jsonwebtoken");
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({ email, password, role, employeeId, studentId }) {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use"
      };
    }
    const hashedPassword = await import_bcryptjs2.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId
    });
    const token = (0, import_jsonwebtoken3.sign)(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
        // Token expira em 1 hora
      }
    );
    return {
      success: true,
      message: "User registered successfully",
      token,
      userId: user.id
    };
  }
};

// src/http/controllers/auth/register.ts
async function registerController(request, reply) {
  const registerSchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6),
    // Definindo uma senha com no mínimo 6 caracteres
    role: import_zod2.z.enum(["STUDENT", "ADMIN", "TEACHER"])
    // Adicionando um enum para o papel do usuário
  });
  const { email, password, role } = registerSchema.parse(request.body);
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  try {
    const result = await registerUseCase.execute({ email, password, role });
    if (result.success) {
      return reply.status(201).send({
        success: result.success,
        message: result.message,
        userId: result.userId,
        token: result.token
      });
    } else {
      return reply.status(400).send({
        success: result.success,
        message: result.message
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// src/http/controllers/auth/routes.ts
async function authRoutes(app) {
  app.post("/auth", loginController);
  app.post("/signup", registerController);
  app.get("/admin-data", { preHandler: accessControlMiddleware(import_client3.Role.ADMIN) }, async (request, reply) => {
    return reply.send({ message: "Admin data" });
  });
  app.get("/user-data", { preHandler: accessControlMiddleware(import_client3.Role.STUDENT) }, async (request, reply) => {
    return reply.send({ message: "STUDENT data" });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authRoutes
});
