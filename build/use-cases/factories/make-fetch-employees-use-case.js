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

// src/use-cases/factories/make-fetch-employees-use-case.ts
var make_fetch_employees_use_case_exports = {};
__export(make_fetch_employees_use_case_exports, {
  makeFetchEmployeesUseCase: () => makeFetchEmployeesUseCase
});
module.exports = __toCommonJS(make_fetch_employees_use_case_exports);

// src/use-cases/employees/fetch-employee.ts
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

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string().optional(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query", "info", "warn", "error"] : []
});

// src/repositories/prisma/prisma-employee-repository.ts
var PrismaEmployeeRepository = class {
  async update(id, data) {
    return await prisma.employee.update({
      where: { id: Number(id) },
      data
    });
  }
  async findByIdentityCardNumber(identityCardNumber) {
    const employee = await prisma.employee.findUnique({
      where: {
        identityCardNumber
      }
    });
    return employee;
  }
  async findByAlternativePhone(phone) {
    const employee = await prisma.employee.findFirst({
      where: {
        alternativePhone: phone
      }
    });
    return employee;
  }
  async findByPhone(phone) {
    const employee = await prisma.employee.findFirst({
      where: {
        phone
      }
    });
    return employee;
  }
  async findByName(name) {
    const employee = await prisma.employee.findFirst({
      where: {
        fullName: {
          contains: name,
          mode: "insensitive"
        }
      }
    });
    return employee;
  }
  async searchMany(page) {
    let pageSize = 20;
    const totalItems = await prisma.employee.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let students = await prisma.employee.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: students
    };
  }
  async destroy(id) {
    let find = await prisma.employee.delete({
      where: {
        id
      }
    });
    return find ? true : false;
  }
  async findById(id) {
    return prisma.employee.findUnique({ where: { id } });
  }
  async create(data) {
    return await prisma.employee.create({
      data: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        alternativePhone: data.alternativePhone,
        gender: data.gender,
        identityCardNumber: data.identityCardNumber,
        emissionDate: data.emissionDate,
        expirationDate: data.expirationDate,
        maritalStatus: data.maritalStatus,
        phone: data.phone,
        residence: data.residence,
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/use-cases/factories/make-fetch-employees-use-case.ts
function makeFetchEmployeesUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  const fetchEmployeeUseCase = new FetchEmployeeUseCase(prismaEmployeeRepository);
  return fetchEmployeeUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeFetchEmployeesUseCase
});
