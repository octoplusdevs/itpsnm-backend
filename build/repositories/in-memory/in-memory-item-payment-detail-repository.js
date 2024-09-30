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

// src/repositories/in-memory/in-memory-item-payment-detail-repository.ts
var in_memory_item_payment_detail_repository_exports = {};
__export(in_memory_item_payment_detail_repository_exports, {
  InMemoryItemPaymentDetailsRepository: () => InMemoryItemPaymentDetailsRepository
});
module.exports = __toCommonJS(in_memory_item_payment_detail_repository_exports);
var import_crypto = require("crypto");
var InMemoryItemPaymentDetailsRepository = class {
  constructor() {
    this.itemPaymentDetails = [];
  }
  async findByPaymentId(paymentId) {
    const items = this.itemPaymentDetails.filter((item) => item.paymentsId === paymentId);
    return items.length > 0 ? items : null;
  }
  async destroy(itemPaymentDetailId) {
    const index = this.itemPaymentDetails.findIndex((item) => item.id === itemPaymentDetailId);
    if (index !== -1) {
      this.itemPaymentDetails.splice(index, 1);
      return true;
    }
    return false;
  }
  async create(data) {
    const itemDetail = {
      ...data,
      id: (0, import_crypto.randomInt)(9999),
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.itemPaymentDetails.push(itemDetail);
    return itemDetail;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryItemPaymentDetailsRepository
});
