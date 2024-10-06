"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/authenticate/register.ts
var register_exports = {};
__export(register_exports, {
  RegisterUseCase: () => RegisterUseCase
});
module.exports = __toCommonJS(register_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = require("jsonwebtoken");

// src/use-cases/errors/employee-not-found.ts
var EmployeeNotFoundError = class extends Error {
  constructor() {
    super("Employee not found.");
  }
};

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/errors/employee-student-not-found.ts
var EmployeeOREnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Employee or Enrollment not found.");
  }
};

// src/use-cases/authenticate/register.ts
var RegisterUseCase = class {
  constructor(usersRepository, enrollmentRepository, employeesRepository) {
    this.usersRepository = usersRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.employeesRepository = employeesRepository;
  }
  async execute({ email, password, role, employeeId, enrollmentId }) {
    if (!employeeId && !enrollmentId) {
      throw new EmployeeOREnrollmentNotFoundError();
    }
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use"
      };
    }
    let existingStudent = null;
    if (enrollmentId !== null && enrollmentId != void 0) {
      existingStudent = await this.enrollmentRepository.checkStatus(enrollmentId);
      if (!existingStudent) {
        throw new EnrollmentNotFoundError();
      }
    }
    if (employeeId !== null && employeeId != void 0) {
      const existingEmployeeId = await this.employeesRepository.findById(employeeId);
      if (!existingEmployeeId) {
        throw new EmployeeNotFoundError();
      }
    }
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId: existingStudent?.id
    });
    const token = (0, import_jsonwebtoken.sign)(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
        // Token expira em 1 hora
      }
    );
    return {
      success: true,
      message: "User registered successfully",
      token,
      userId: user.id
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterUseCase
});
