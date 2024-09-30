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

// src/use-cases/factories/make-register-user-use-case.ts
var make_register_user_use_case_exports = {};
__export(make_register_user_use_case_exports, {
  makeRegisterUseCase: () => makeRegisterUseCase
});
module.exports = __toCommonJS(make_register_user_use_case_exports);

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

// src/use-cases/authenticate/register.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = require("jsonwebtoken");
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
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId
    });
    const token = (0, import_jsonwebtoken.sign)(
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

// src/use-cases/factories/make-register-user-use-case.ts
function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  return registerUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeRegisterUseCase
});
