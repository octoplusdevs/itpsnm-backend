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

// src/repositories/prisma/prisma-user-repository.ts
var import_client = require("@prisma/client");
var PrismaUserRepository = class {
  constructor() {
    this.prisma = new import_client.PrismaClient();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessControlMiddleware
});
