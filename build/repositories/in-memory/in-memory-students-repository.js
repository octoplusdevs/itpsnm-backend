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

// src/repositories/in-memory/in-memory-students-repository.ts
var in_memory_students_repository_exports = {};
__export(in_memory_students_repository_exports, {
  InMemoryStudentRepository: () => InMemoryStudentRepository
});
module.exports = __toCommonJS(in_memory_students_repository_exports);
var import_crypto = require("crypto");
var InMemoryStudentRepository = class {
  constructor() {
    this.items = [];
  }
  async findById(id) {
    const student = this.items.find((item) => item.id === id);
    if (!student) {
      return null;
    }
    return student;
  }
  async findByName(name) {
    const student = this.items.filter((item) => item.fullName.includes(name));
    if (!student) {
      return null;
    }
    return student[0];
  }
  async create(data) {
    const newStudent = {
      id: data.id ?? (0, import_crypto.randomInt)(9999),
      type: data.type,
      fullName: data.fullName,
      father: data.father,
      mother: data.mother,
      dateOfBirth: new Date(data.dateOfBirth),
      height: data.height,
      identityCardNumber: data.identityCardNumber,
      gender: data.gender,
      emissionDate: new Date(data.emissionDate),
      expirationDate: new Date(data.expirationDate),
      maritalStatus: data.maritalStatus,
      residence: data.residence,
      phone: data.phone,
      alternativePhone: data.alternativePhone ?? null,
      countyId: data.countyId,
      provinceId: data.provinceId,
      created_at: data.createdAt ?? /* @__PURE__ */ new Date(),
      update_at: data.updatedAt ?? /* @__PURE__ */ new Date()
    };
    this.items.push(newStudent);
    return newStudent;
  }
  async searchMany(query, page) {
    const pageSize = 20;
    const filteredItems = this.items.filter((item) => item.fullName.includes(query));
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items
    };
  }
  async destroy(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
  async findByPhone(phone) {
    const student = this.items.find((item) => item.phone === phone);
    if (!student) {
      return null;
    }
    return student;
  }
  async findByAlternativePhone(phone) {
    const student = this.items.find((item) => item.alternativePhone === phone);
    if (!student) {
      return null;
    }
    return student;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    const student = this.items.find((item) => item.identityCardNumber === identityCardNumber);
    if (!student) {
      return null;
    }
    return student;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryStudentRepository
});
