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

// src/repositories/in-memory/in-memory-receipt-repository.ts
var in_memory_receipt_repository_exports = {};
__export(in_memory_receipt_repository_exports, {
  InMemoryReceiptsRepository: () => InMemoryReceiptsRepository
});
module.exports = __toCommonJS(in_memory_receipt_repository_exports);
var import_crypto = require("crypto");
var InMemoryReceiptsRepository = class {
  constructor() {
    this.receipts = [];
  }
  async findById(receiptId) {
    const receipt = this.receipts.find((receipt2) => receipt2.id === receiptId);
    return receipt || null;
  }
  async findManyByTuitionId(tuitionId) {
    const receipts = this.receipts.filter((receipt) => receipt.tuition_id === tuitionId);
    return receipts.length > 0 ? receipts : null;
  }
  async destroy(receiptId) {
    const index = this.receipts.findIndex((receipt) => receipt.id === receiptId);
    if (index !== -1) {
      this.receipts.splice(index, 1);
      return true;
    }
    return false;
  }
  async create(data) {
    const receipt = {
      ...data,
      id: (0, import_crypto.randomInt)(9999),
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.receipts.push(receipt);
    return receipt;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryReceiptsRepository
});
