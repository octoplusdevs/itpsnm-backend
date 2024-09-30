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

// src/repositories/in-memory/in-memory-subjects-repository.ts
var in_memory_subjects_repository_exports = {};
__export(in_memory_subjects_repository_exports, {
  InMemorySubjectsRepository: () => InMemorySubjectsRepository
});
module.exports = __toCommonJS(in_memory_subjects_repository_exports);
var import_crypto = require("crypto");
var InMemorySubjectsRepository = class {
  constructor() {
    this.items = [];
  }
  async findById(id) {
    const Subject = this.items.find((item) => item.id === id);
    if (!Subject) {
      return null;
    }
    return Subject;
  }
  async findByName(name) {
    const Subject = this.items.find((item) => item.name === name);
    if (!Subject) {
      return null;
    }
    return Subject;
  }
  async create(data) {
    const course = {
      id: data.id ?? (0, import_crypto.randomInt)(99999),
      name: data.name,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.items.push(course);
    return course;
  }
  async searchMany(query, page) {
    return this.items.filter((item) => item.name.includes(query)).slice((page - 1) * 20, page * 20);
  }
  async destroy(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemorySubjectsRepository
});
