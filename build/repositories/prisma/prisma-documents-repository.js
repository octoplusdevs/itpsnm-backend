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

// src/repositories/prisma/prisma-documents-repository.ts
var prisma_documents_repository_exports = {};
__export(prisma_documents_repository_exports, {
  PrismaDocumentRepository: () => PrismaDocumentRepository
});
module.exports = __toCommonJS(prisma_documents_repository_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-documents-repository.ts
var PrismaDocumentRepository = class {
  findById(fileId) {
    throw new Error("Method not implemented.");
  }
  destroy(fileId) {
    throw new Error("Method not implemented.");
  }
  async create(data) {
    const findDocument = await prisma.document.findFirst({
      where: {
        enrollmentId: data.enrollmentId
      }
    });
    if (findDocument) {
      return await prisma.document.update({
        where: {
          id: findDocument.id
        },
        data: {
          enrollmentId: data.enrollmentId
        }
      });
    }
    const document = await prisma.document.create({
      data: {
        enrollmentId: data.enrollmentId
      }
    });
    return document;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaDocumentRepository
});
