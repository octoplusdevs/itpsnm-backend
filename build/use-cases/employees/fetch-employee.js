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

// src/use-cases/employees/fetch-employee.ts
var fetch_employee_exports = {};
__export(fetch_employee_exports, {
  FetchEmployeeUseCase: () => FetchEmployeeUseCase
});
module.exports = __toCommonJS(fetch_employee_exports);
var FetchEmployeeUseCase = class {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }
  async execute({
    page
  }) {
    const employees = await this.employeeRepository.searchMany(
      page
    );
    return {
      employees
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchEmployeeUseCase
});
