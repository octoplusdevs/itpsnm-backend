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

// src/use-cases/factories/make-fetch-student-use-case.ts
var make_fetch_student_use_case_exports = {};
__export(make_fetch_student_use_case_exports, {
  makeFetchStudentUseCase: () => makeFetchStudentUseCase
});
module.exports = __toCommonJS(make_fetch_student_use_case_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
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

// src/use-cases/student/fetch-student.ts
var FetchStudentUseCase = class {
  constructor(studentsRepository) {
    this.studentsRepository = studentsRepository;
  }
  async execute({
    query,
    page
  }) {
    const students = await this.studentsRepository.searchMany(
      query,
      page
    );
    return {
      students
    };
  }
};

// src/use-cases/factories/make-fetch-student-use-case.ts
function makeFetchStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository();
  const fetchStudentUseCase = new FetchStudentUseCase(prismaStudentsRepository);
  return fetchStudentUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeFetchStudentUseCase
});
