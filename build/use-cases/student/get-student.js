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

// src/use-cases/student/get-student.ts
var get_student_exports = {};
__export(get_student_exports, {
  GetStudentUseCase: () => GetStudentUseCase
});
module.exports = __toCommonJS(get_student_exports);

// src/use-cases/errors/student-not-found.ts
var StudentNotFoundError = class extends Error {
  constructor() {
    super("Student not found.");
  }
};

// src/use-cases/student/get-student.ts
var GetStudentUseCase = class {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }
  async execute({
    id,
    alternativePhone,
    identityCardNumber,
    name,
    phone
  }) {
    let student = null;
    if (id !== void 0) {
      student = await this.studentRepository.findById(id);
    }
    if (identityCardNumber !== void 0) {
      student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    }
    if (alternativePhone !== void 0) {
      student = await this.studentRepository.findByAlternativePhone(alternativePhone);
    }
    if (phone !== void 0) {
      student = await this.studentRepository.findByPhone(phone);
    }
    if (name !== void 0) {
      student = await this.studentRepository.findByName(name);
    }
    if (!student) {
      throw new StudentNotFoundError();
    }
    return student;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetStudentUseCase
});
