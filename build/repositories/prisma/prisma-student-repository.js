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

// src/repositories/prisma/prisma-student-repository.ts
var prisma_student_repository_exports = {};
__export(prisma_student_repository_exports, {
  PrismaStudentsRepository: () => PrismaStudentsRepository
});
module.exports = __toCommonJS(prisma_student_repository_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaStudentsRepository
});
