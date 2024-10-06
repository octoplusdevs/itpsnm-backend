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

// src/use-cases/employees/update-employee.ts
var update_employee_exports = {};
__export(update_employee_exports, {
  UpdateEmployeeUseCase: () => UpdateEmployeeUseCase
});
module.exports = __toCommonJS(update_employee_exports);

// src/use-cases/errors/phone-already-exists-error.ts
var PhoneAlreadyExistsError = class extends Error {
  constructor() {
    super("Phone already exists.");
  }
};

// src/use-cases/errors/id-card-already-exists-error.ts
var IdentityCardNumberAlreadyExistsError = class extends Error {
  constructor() {
    super("Identity card number already exists.");
  }
};

// src/use-cases/errors/employee-not-found.ts
var EmployeeNotFoundError = class extends Error {
  constructor() {
    super("Employee not found.");
  }
};

// src/use-cases/employees/update-employee.ts
var UpdateEmployeeUseCase = class {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }
  async execute({
    id,
    fullName,
    dateOfBirth,
    emissionDate,
    expirationDate,
    gender,
    identityCardNumber,
    maritalStatus,
    phone,
    residence,
    alternativePhone
  }) {
    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new EmployeeNotFoundError();
    }
    if (phone) {
      const userWithSamePhone = await this.employeeRepository.findByPhone(phone);
      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new PhoneAlreadyExistsError();
      }
    }
    if (identityCardNumber) {
      const userWithSameBI = await this.employeeRepository.findByIdentityCardNumber(identityCardNumber);
      if (userWithSameBI && userWithSameBI.id !== id) {
        throw new IdentityCardNumberAlreadyExistsError();
      }
    }
    const updatedEmployee = await this.employeeRepository.update(id, {
      fullName,
      dateOfBirth,
      emissionDate,
      expirationDate,
      gender,
      identityCardNumber,
      maritalStatus,
      phone,
      residence,
      alternativePhone
    });
    return {
      employee: updatedEmployee
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateEmployeeUseCase
});
