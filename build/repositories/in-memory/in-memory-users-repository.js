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

// src/repositories/in-memory/in-memory-users-repository.ts
var in_memory_users_repository_exports = {};
__export(in_memory_users_repository_exports, {
  InMemoryUserRepository: () => InMemoryUserRepository
});
module.exports = __toCommonJS(in_memory_users_repository_exports);
var InMemoryUserRepository = class {
  constructor() {
    this.users = [];
    this.accessLogs = [];
  }
  async findById(id) {
    return this.users.find((user) => user.id === id) || null;
  }
  async findByEmail(email) {
    return this.users.find((user) => user.email === email) || null;
  }
  async create(data) {
    const user = {
      id: this.users.length + 1,
      email: data.email,
      password: data.password,
      role: data.role,
      loginAttempt: 0,
      isBlocked: false,
      isActive: true,
      lastLogin: /* @__PURE__ */ new Date(),
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date(),
      employeeId: data.employeeId ?? null,
      studentId: data.studentId ?? null
    };
    this.users.push(user);
    return user;
  }
  async updateLoginAttempt(id, attempts) {
    const user = await this.findById(id);
    if (user) {
      user.loginAttempt = attempts;
      user.update_at = /* @__PURE__ */ new Date();
    }
  }
  async blockUser(id) {
    const user = await this.findById(id);
    if (user) {
      user.isBlocked = true;
      user.update_at = /* @__PURE__ */ new Date();
    }
  }
  async logAccess(userId, status) {
    this.accessLogs.push({ userId, status, timestamp: /* @__PURE__ */ new Date() });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryUserRepository
});
