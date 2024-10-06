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

// src/http/controllers/employees/routes.ts
var routes_exports = {};
__export(routes_exports, {
  employeesRoutes: () => employeesRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/employees/create.ts
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

// src/http/controllers/employees/fetch.ts
var import_zod3 = require("zod");

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

// src/use-cases/factories/make-fetch-employees-use-case.ts
function makeFetchEmployeesUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  const fetchEmployeeUseCase = new FetchEmployeeUseCase(prismaEmployeeRepository);
  return fetchEmployeeUseCase;
}

// src/http/controllers/employees/fetch.ts
async function fetch(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    query: import_zod3.z.string().optional(),
    page: import_zod3.z.coerce.number().int().positive().optional()
  });
  const { page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchEmployeesUseCase = makeFetchEmployeesUseCase();
    let employees = await fetchEmployeesUseCase.execute({
      page
    });
    return reply.status(200).send(employees);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/http/controllers/employees/update.ts
var import_zod4 = require("zod");

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

// src/use-cases/factories/make-update-employee-use-case.ts
function makeUpdateEmployeeUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  const updateUseCase = new UpdateEmployeeUseCase(prismaEmployeeRepository);
  return updateUseCase;
}

// src/http/controllers/employees/update.ts
async function update(request, reply) {
  const updateBodySchema = import_zod4.z.object({
    fullName: import_zod4.z.string().optional(),
    dateOfBirth: import_zod4.z.coerce.date().optional(),
    emissionDate: import_zod4.z.coerce.date().optional(),
    expirationDate: import_zod4.z.coerce.date().optional(),
    gender: import_zod4.z.enum(["MALE", "FEMALE"]).optional(),
    identityCardNumber: import_zod4.z.string().optional(),
    maritalStatus: import_zod4.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
    phone: import_zod4.z.string().optional(),
    residence: import_zod4.z.string().optional(),
    alternativePhone: import_zod4.z.string().optional()
  });
  try {
    const { id } = request.params;
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
    } = updateBodySchema.parse(request.body);
    const updateEmployeeUseCase = makeUpdateEmployeeUseCase();
    const employee = await updateEmployeeUseCase.execute({
      id: Number(id),
      // Converte o ID para número
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
    return reply.status(200).send(employee);
  } catch (err) {
    if (err instanceof PhoneAlreadyExistsError || err instanceof IdentityCardNumberAlreadyExistsError) {
      return reply.status(409).send({ message: err?.message });
    }
    return reply.status(500).send({ error: err });
  }
}

// src/use-cases/employees/fetch-by-id-employee.ts
var FetchEmployeeByIdUseCase = class {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }
  async execute(id) {
    const employee = await this.employeeRepository.findById(Number(id));
    return {
      employee
    };
  }
};

// src/use-cases/factories/make-fetch-employee-by-id-use-case.ts
function makeFetchEmployeeByIdUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  const fetchEmployeeUseCase = new FetchEmployeeByIdUseCase(prismaEmployeeRepository);
  return fetchEmployeeUseCase;
}

// src/http/controllers/employees/fetch-by-id.ts
async function fetchById(request, reply) {
  const { id } = request.params;
  try {
    const fetchEmployeeByIdUseCase = makeFetchEmployeeByIdUseCase();
    const employee = await fetchEmployeeByIdUseCase.execute(id);
    if (!employee) {
      return reply.status(404).send({ message: "Employee not found" });
    }
    return reply.status(200).send(employee);
  } catch (err) {
    return reply.status(500).send({ error: err });
  }
}

// src/http/controllers/employees/routes.ts
async function employeesRoutes(app) {
  app.put("/employees/:id", update);
  app.get("/employees/:id", fetchById);
  app.post("/employees", create);
  app.get("/employees", fetch);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  employeesRoutes
});
