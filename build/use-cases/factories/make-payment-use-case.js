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

// src/use-cases/factories/make-payment-use-case.ts
var make_payment_use_case_exports = {};
__export(make_payment_use_case_exports, {
  makePaymentUseCase: () => makePaymentUseCase
});
module.exports = __toCommonJS(make_payment_use_case_exports);

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

// src/repositories/prisma/prisma-payments-repository.ts
var PrismaPaymentRepository = class {
  async create(paymentData, itemDetailsData) {
    let payment = await prisma.payment.create({
      data: {
        identityCardNumber: paymentData.identityCardNumber,
        amount_paid: paymentData.amount_paid,
        date: paymentData.date,
        state: paymentData.state,
        item_payment_details: {
          createMany: {
            data: {
              price: itemDetailsData.price,
              type: itemDetailsData.type,
              quantity: itemDetailsData?.quantity
            }
          }
        }
      }
    });
    return payment;
  }
  findById(paymentId) {
    throw new Error("Method not implemented.");
  }
  findManyByIdentityCardNumber(identityCardNumber) {
    throw new Error("Method not implemented.");
  }
  destroy(paymentId) {
    throw new Error("Method not implemented.");
  }
  searchMany(query, page) {
    throw new Error("Method not implemented.");
  }
};

// src/repositories/prisma/prisma-student-repository.ts
var PrismaStudentsRepository = class {
  async findById(id) {
    let findStudent = await prisma.student.findUnique({
      where: {
        id
      }
    });
    return findStudent;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    let findStudent = await prisma.student.findUnique({
      where: {
        identityCardNumber
      }
    });
    return findStudent;
  }
  async findByAlternativePhone(phone) {
    let findStudent = await prisma.student.findFirst({
      where: {
        alternativePhone: phone
      }
    });
    return findStudent;
  }
  async findByPhone(phone) {
    let findStudent = await prisma.student.findUnique({
      where: {
        phone
      }
    });
    return findStudent;
  }
  findByName(name) {
    throw new Error("Method not implemented.");
  }
  // async findByEmail(email: string): Promise<Student | null> {
  //   let findStudent = await prisma.student.findUnique({
  //     where: {
  //       email
  //     }
  //   })
  //   return findStudent
  // }
  async create(data) {
    let {
      id,
      countyId,
      dateOfBirth,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone
    } = data;
    let student = await prisma.student.create({
      data: {
        id,
        countyId,
        dateOfBirth,
        emissionDate,
        expirationDate,
        father,
        fullName,
        gender,
        height,
        identityCardNumber,
        maritalStatus,
        mother,
        phone,
        provinceId,
        residence,
        type,
        alternativePhone
      }
    });
    return student;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    const totalItems = await prisma.student.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let students = await prisma.student.findMany({
      where: {
        fullName: {
          contains: query,
          mode: "insensitive"
        }
      },
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
    let destroyStudent = await prisma.student.delete({
      where: {
        id
      }
    });
    return destroyStudent ? true : false;
  }
};

// src/use-cases/factories/make-payment-use-case.ts
function makePaymentUseCase() {
  const prismaPaymentRepository = new PrismaPaymentRepository();
  const prismaStudentRepository = new PrismaStudentsRepository();
  const createDocumentWithFilesUseCase = new CreatePaymentUseCase(prismaPaymentRepository, prismaStudentRepository);
  return createDocumentWithFilesUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makePaymentUseCase
});
