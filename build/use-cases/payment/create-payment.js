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

// src/use-cases/payment/create-payment.ts
var create_payment_exports = {};
__export(create_payment_exports, {
  CreatePaymentUseCase: () => CreatePaymentUseCase
});
module.exports = __toCommonJS(create_payment_exports);

// src/use-cases/errors/student-not-found.ts
var StudentNotFoundError = class extends Error {
  constructor() {
    super("Student not found.");
  }
};

// src/use-cases/payment/create-payment.ts
var CreatePaymentUseCase = class {
  constructor(paymentsRepository, studentsRepository) {
    this.paymentsRepository = paymentsRepository;
    this.studentsRepository = studentsRepository;
  }
  async execute(request) {
    const { identityCardNumber, state, date, items } = request;
    const student = await this.studentsRepository.findByIdentityCardNumber(identityCardNumber);
    if (!student) {
      throw new StudentNotFoundError();
    }
    const amount_paid = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const payment = await this.paymentsRepository.create(
      {
        identityCardNumber,
        state,
        amount_paid,
        date
      },
      items.map((item) => ({
        type: item.type,
        quantity: item.quantity,
        price: item.price
      }))
    );
    return payment;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePaymentUseCase
});
