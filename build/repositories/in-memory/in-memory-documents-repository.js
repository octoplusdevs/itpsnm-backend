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

// src/repositories/in-memory/in-memory-documents-repository.ts
var in_memory_documents_repository_exports = {};
__export(in_memory_documents_repository_exports, {
  InMemoryDocumentsRepository: () => InMemoryDocumentsRepository
});
module.exports = __toCommonJS(in_memory_documents_repository_exports);
var InMemoryDocumentsRepository = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const document = {
      id: this.items.length + 1,
      enrollmentId: data.enrollmentId,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.items.push(document);
    return document;
  }
  async findById(DocumentId) {
    return this.items.find((file) => file.id === DocumentId) || null;
  }
  async destroy(DocumentId) {
    const index = this.items.findIndex((item) => item.id === DocumentId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryDocumentsRepository
});
