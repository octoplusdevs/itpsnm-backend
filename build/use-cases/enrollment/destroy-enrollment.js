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

// src/use-cases/enrollment/destroy-enrollment.ts
var destroy_enrollment_exports = {};
__export(destroy_enrollment_exports, {
  DestroyEnrollmentUseCase: () => DestroyEnrollmentUseCase
});
module.exports = __toCommonJS(destroy_enrollment_exports);

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/enrollment/destroy-enrollment.ts
var DestroyEnrollmentUseCase = class {
  constructor(enrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }
  async execute({
    enrollmentId
  }) {
    let enrollment = await this.enrollmentRepository.checkStatus(enrollmentId);
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    return await this.enrollmentRepository.destroy(
      enrollmentId
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DestroyEnrollmentUseCase
});
