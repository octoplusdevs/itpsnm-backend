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

// src/repositories/in-memory/in-memory-payments-repository.ts
var in_memory_payments_repository_exports = {};
__export(in_memory_payments_repository_exports, {
  InMemoryPaymentsRepository: () => InMemoryPaymentsRepository
});
module.exports = __toCommonJS(in_memory_payments_repository_exports);
var import_crypto = require("crypto");
var InMemoryPaymentsRepository = class {
  constructor() {
    this.payments = [];
    this.itemPaymentDetails = [];
  }
  async findById(paymentId) {
    const payment = this.payments.find((payment2) => payment2.id === paymentId);
    return payment || null;
  }
  async searchMany(query, page) {
    return this.payments.filter((payment) => payment.state.includes(query)).slice((page - 1) * 20, page * 20);
  }
  async findManyByIdentityCardNumber(identityCardNumber) {
    const payments = this.payments.filter((payment) => payment.identityCardNumber === identityCardNumber);
    return payments.length > 0 ? payments : null;
  }
  async destroy(paymentId) {
    const index = this.payments.findIndex((payment) => payment.id === paymentId);
    if (index !== -1) {
      this.payments.splice(index, 1);
      return true;
    }
    return false;
  }
  async create(paymentData, itemDetailsData) {
    const payment = {
      ...paymentData,
      id: (0, import_crypto.randomInt)(9999),
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date()
    };
    this.payments.push(payment);
    itemDetailsData.forEach((itemData) => {
      const itemDetail = {
        ...itemData,
        id: (0, import_crypto.randomInt)(9999),
        paymentsId: payment.id,
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
      };
      this.itemPaymentDetails.push(itemDetail);
    });
    return payment;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryPaymentsRepository
});
