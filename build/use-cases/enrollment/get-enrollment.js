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

// src/use-cases/enrollment/get-enrollment.ts
var get_enrollment_exports = {};
__export(get_enrollment_exports, {
  GetEnrollmentUseCase: () => GetEnrollmentUseCase
});
module.exports = __toCommonJS(get_enrollment_exports);

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/enrollment/get-enrollment.ts
var GetEnrollmentUseCase = class {
  constructor(enrollmentsRepository) {
    this.enrollmentsRepository = enrollmentsRepository;
  }
  async execute({
    enrollmentNumber,
    identityCardNumber
  }) {
    let enrollment = null;
    if (enrollmentNumber != null || enrollmentNumber != void 0) {
      enrollment = await this.enrollmentsRepository.checkStatus(enrollmentNumber);
    }
    if (identityCardNumber != null || identityCardNumber != void 0) {
      enrollment = await this.enrollmentsRepository.findByIdentityCardNumber(identityCardNumber);
    }
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    return {
      enrollment
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetEnrollmentUseCase
});
