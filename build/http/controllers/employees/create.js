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

// src/http/controllers/employees/create.ts
var create_exports = {};
__export(create_exports, {
  create: () => create
});
module.exports = __toCommonJS(create_exports);
var import_zod2 = require("zod");

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

// src/use-cases/employees/create-employee.ts
var CreateEmployeeUseCase = class {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }
  async execute({
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
    const userWithSamePhone = await this.employeeRepository.findByPhone(phone);
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError();
    }
    const userWithSameBI = await this.employeeRepository.findByIdentityCardNumber(identityCardNumber);
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError();
    }
    const employee = await this.employeeRepository.create({
      dateOfBirth,
      emissionDate,
      expirationDate,
      fullName,
      gender,
      identityCardNumber,
      maritalStatus,
      phone,
      residence,
      alternativePhone
    });
    return {
      employee
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

// src/use-cases/factories/make-create-employee-use-case.ts
function makeCreateEmployeeUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  return new CreateEmployeeUseCase(prismaEmployeeRepository);
}

// src/http/controllers/employees/create.ts
async function create(request, reply) {
  const createBodySchema = import_zod2.z.object({
    fullName: import_zod2.z.string(),
    dateOfBirth: import_zod2.z.coerce.date(),
    emissionDate: import_zod2.z.coerce.date(),
    expirationDate: import_zod2.z.coerce.date(),
    gender: import_zod2.z.enum(["MALE", "FEMALE"]),
    identityCardNumber: import_zod2.z.string(),
    maritalStatus: import_zod2.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    phone: import_zod2.z.string(),
    residence: import_zod2.z.string(),
    alternativePhone: import_zod2.z.string().optional()
  });
  try {
    const {
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
    } = createBodySchema.parse(request.body);
    const createEmployeeUseCase = makeCreateEmployeeUseCase();
    const employee = await createEmployeeUseCase.execute({
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
    return reply.status(201).send(employee);
  } catch (err) {
    if (err instanceof PhoneAlreadyExistsError || err instanceof IdentityCardNumberAlreadyExistsError) {
      return reply.status(409).send({ message: err?.message });
    }
    return reply.status(500).send({ error: err });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create
});
