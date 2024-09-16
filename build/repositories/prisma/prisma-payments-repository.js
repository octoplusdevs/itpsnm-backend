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

// src/repositories/prisma/prisma-payments-repository.ts
var prisma_payments_repository_exports = {};
__export(prisma_payments_repository_exports, {
  PrismaPaymentRepository: () => PrismaPaymentRepository
});
module.exports = __toCommonJS(prisma_payments_repository_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-payments-repository.ts
var PrismaPaymentRepository = class {
  async create(paymentData, itemDetailsData) {
    let payment = await prisma.payment.create({
      data: {
        identityCardNumber: paymentData.identityCardNumber,
        amount_paid: paymentData.amount_paid,
        date: paymentData.date,
        state: paymentData.state,
        item_payment_details: {
          createMany: {
            data: {
              price: itemDetailsData.price,
              type: itemDetailsData.type,
              quantity: itemDetailsData?.quantity
            }
          }
        }
      }
    });
    return payment;
  }
  findById(paymentId) {
    throw new Error("Method not implemented.");
  }
  findManyByIdentityCardNumber(identityCardNumber) {
    throw new Error("Method not implemented.");
  }
  destroy(paymentId) {
    throw new Error("Method not implemented.");
  }
  searchMany(query, page) {
    throw new Error("Method not implemented.");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaPaymentRepository
});
