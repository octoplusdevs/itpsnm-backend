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

// src/repositories/prisma/prisma-level-repository.ts
var prisma_level_repository_exports = {};
__export(prisma_level_repository_exports, {
  PrismaLevelsRepository: () => PrismaLevelsRepository
});
module.exports = __toCommonJS(prisma_level_repository_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-level-repository.ts
var PrismaLevelsRepository = class {
  async create(data) {
    let newLevel = await prisma.level.create({
      data: {
        name: data.name
      }
    });
    return newLevel;
  }
  async searchMany() {
    return await prisma.level.findMany();
  }
  async destroy(id) {
    let level = await prisma.level.delete({
      where: {
        id
      }
    });
    return level ? true : false;
  }
  async findById(id) {
    const level = await prisma.level.findUnique({
      where: {
        id
      }
    });
    return level;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaLevelsRepository
});
