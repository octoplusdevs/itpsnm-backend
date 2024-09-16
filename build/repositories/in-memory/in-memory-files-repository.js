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

// src/repositories/in-memory/in-memory-files-repository.ts
var in_memory_files_repository_exports = {};
__export(in_memory_files_repository_exports, {
  InMemoryFilesRepository: () => InMemoryFilesRepository
});
module.exports = __toCommonJS(in_memory_files_repository_exports);
var InMemoryFilesRepository = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const file = {
      id: this.items.length + 1,
      name: data.name,
      path: data.path,
      format: data.format,
      type: data.type,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date(),
      identityCardNumber: data.identityCardNumber,
      documentId: data.documentId
    };
    this.items.push(file);
    return file;
  }
  async findById(id) {
    const file = this.items.find((file2) => file2.id === id);
    return file || null;
  }
  async findAllFilesStudentByIdentityCardNumber(identityCardNumber) {
    return this.items.filter((file) => file.identityCardNumber === identityCardNumber);
  }
  async update(id, data) {
    const fileIndex = this.items.findIndex((file) => file.id === id);
    if (fileIndex === -1)
      return null;
    const updatedFile = {
      ...this.items[fileIndex],
      ...data,
      update_at: /* @__PURE__ */ new Date()
    };
    this.items[fileIndex] = updatedFile;
    return updatedFile;
  }
  async destroy(id) {
    this.items = this.items.filter((file) => file.id !== id);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryFilesRepository
});
