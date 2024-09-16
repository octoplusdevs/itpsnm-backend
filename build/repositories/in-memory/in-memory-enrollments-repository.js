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

// src/repositories/in-memory/in-memory-enrollments-repository.ts
var in_memory_enrollments_repository_exports = {};
__export(in_memory_enrollments_repository_exports, {
  InMemoryEnrollmentRepository: () => InMemoryEnrollmentRepository
});
module.exports = __toCommonJS(in_memory_enrollments_repository_exports);
var import_crypto = require("crypto");
var InMemoryEnrollmentRepository = class {
  constructor() {
    this.items = [];
  }
  async findById(enrollmentId) {
    const enrollment = this.items.find((item) => item.id === enrollmentId);
    if (!enrollment) {
      return null;
    }
    return enrollment;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    const enrollment = this.items.find((item) => item.identityCardNumber === identityCardNumber);
    if (!enrollment) {
      return null;
    }
    return enrollment;
  }
  async checkStatus(enrollmentId) {
    const enrollment = this.items.find((item) => item.id === enrollmentId);
    if (!enrollment) {
      return null;
    }
    return {
      id: enrollment.id,
      paymentState: enrollment.paymentState,
      docsState: enrollment.docsState,
      identityCardNumber: enrollment.identityCardNumber,
      classeId: enrollment.classeId,
      courseId: enrollment.courseId,
      levelId: enrollment.levelId,
      created_at: enrollment.created_at,
      update_at: enrollment.update_at
    };
  }
  async toggleStatus(enrollmentId, docsState, paymentState) {
    const enrollment = this.items.find((item) => item.id === enrollmentId);
    if (!enrollment) {
      return null;
    }
    enrollment.paymentState = paymentState;
    enrollment.docsState = docsState;
    return {
      id: enrollment.id,
      paymentState: enrollment.paymentState,
      docsState: enrollment.docsState
    };
  }
  async destroy(enrollmentId) {
    const index = this.items.findIndex((item) => item.id === enrollmentId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
  async create(data) {
    const enrollment = {
      id: data.id ?? (0, import_crypto.randomInt)(9999),
      docsState: data.docsState,
      paymentState: data.paymentState,
      identityCardNumber: data.identityCardNumber,
      courseId: data.courseId,
      levelId: data.levelId,
      classeId: data.classeId ?? null,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.items.push(enrollment);
    return enrollment;
  }
  async searchMany(paymentState, docsState, page) {
    const pageSize = 20;
    const filteredItems = this.items.filter((item) => item.docsState.includes(docsState) || item.paymentState.includes(paymentState));
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryEnrollmentRepository
});
