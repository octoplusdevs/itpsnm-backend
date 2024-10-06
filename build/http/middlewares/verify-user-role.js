"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/middlewares/verify-user-role.ts
var verify_user_role_exports = {};
__export(verify_user_role_exports, {
  accessControlMiddleware: () => accessControlMiddleware
});
module.exports = __toCommonJS(verify_user_role_exports);
var import_jsonwebtoken = require("jsonwebtoken");

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

// src/http/middlewares/verify-user-role.ts
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
        decodedToken = (0, import_jsonwebtoken.verify)(token, secretKey);
      } catch (error) {
        return reply.status(401).send({ message: "Unauthorized: Invalid token" });
      }
      const { userId } = decodedToken;
      const usersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);
      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: "Unauthorized: User is blocked or inactive" });
      }
      if (!requiredRole.includes(user.role)) {
        return reply.status(403).send({ message: "Forbidden: Access denied" });
      }
      request.user = user;
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessControlMiddleware
});
