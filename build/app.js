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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));
var import_zod18 = require("zod");

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

// src/use-cases/errors/course-already-exists-error.ts
var CourseAlreadyExistsError = class extends Error {
  constructor() {
    super("Course name already exists.");
  }
};

// src/use-cases/course/create-course.ts
var CreateCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    name
  }) {
    const course = await this.coursesRepository.create({
      name
    });
    return {
      course
    };
  }
};

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-course-repository.ts
var PrismaCoursesRepository = class {
  async findByName(name) {
    const findCourse = await prisma.course.findUnique({
      where: {
        name
      }
    });
    return findCourse;
  }
  async create(data) {
    let newCourse = await prisma.course.create({
      data: {
        name: data.name
      }
    });
    return newCourse;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let courses = await prisma.course.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return courses;
  }
  async destroy(id) {
    let findCourse = await prisma.course.delete({
      where: {
        id
      }
    });
    return findCourse ? true : false;
  }
  async findById(id) {
    const course = await prisma.course.findUnique({
      where: {
        id
      }
    });
    return course;
  }
};

// src/use-cases/factories/make-course-use-case.ts
function makeCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const createCourseUseCase = new CreateCourseUseCase(prismaCoursesRepository);
  return createCourseUseCase;
}

// src/http/controllers/courses/create.ts
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    name: import_zod2.z.string()
  });
  const { name } = registerBodySchema.parse(request.body);
  try {
    const courseUseCase = makeCourseUseCase();
    await courseUseCase.execute({
      name
    });
  } catch (err) {
    if (err instanceof CourseAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/errors/resource-not-found.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found.");
  }
};

// src/use-cases/course/destroy-course.ts
var DestroyCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    id
  }) {
    return await this.coursesRepository.destroy(
      id
    );
  }
};

// src/use-cases/factories/make-destroy-course-use-case.ts
function makeDestroyCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const destroyCourseUseCase = new DestroyCourseUseCase(prismaCoursesRepository);
  return destroyCourseUseCase;
}

// src/http/controllers/courses/destroy.ts
var import_zod3 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    id: import_zod3.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const courseUseCase = makeDestroyCourseUseCase();
    await courseUseCase.execute({
      id
    });
  } catch (err) {
    if (err instanceof CourseAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/courses/routes.ts
async function coursesRoutes(app2) {
  app2.post("/courses", create);
  app2.delete("/courses/:id", destroy);
}

// src/http/controllers/students/create.ts
var import_zod4 = require("zod");

// src/use-cases/errors/phone-already-exists-error.ts
var PhoneAlreadyExistsError = class extends Error {
  constructor() {
    super("Phone already exists.");
  }
};

// src/use-cases/errors/alternative-phone-already-exists-error.ts
var AlternativePhoneAlreadyExistsError = class extends Error {
  constructor() {
    super("Alternative phone already exists.");
  }
};

// src/use-cases/errors/id-card-already-exists-error.ts
var IdentityCardNumberAlreadyExistsError = class extends Error {
  constructor() {
    super("Identity card number already exists.");
  }
};

// src/use-cases/errors/province-not-found.ts
var ProvinceNotFoundError = class extends Error {
  constructor() {
    super("Province not found.");
  }
};

// src/use-cases/errors/county-not-found.ts
var CountyNotFoundError = class extends Error {
  constructor() {
    super("County not found.");
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

// src/use-cases/student/create-student.ts
var CreateStudentUseCase = class {
  constructor(studentRepository, provinceRepository, countyRepository) {
    this.studentRepository = studentRepository;
    this.provinceRepository = provinceRepository;
    this.countyRepository = countyRepository;
  }
  async execute({
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
  }) {
    const userWithSamePhone = await this.studentRepository.findByPhone(phone);
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError();
    }
    const userWithSameBI = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError();
    }
    const findProvince = await this.provinceRepository.findById(provinceId);
    if (!findProvince) {
      throw new ProvinceNotFoundError();
    }
    const findCounty = await this.countyRepository.findById(countyId);
    if (!findCounty) {
      throw new CountyNotFoundError();
    }
    const student = await this.studentRepository.create({
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
    });
    return {
      student
    };
  }
};

// src/repositories/prisma/prisma-province-repository.ts
var PrismaProvincesRepository = class {
  async findByName(name) {
    const findProvince = await prisma.province.findUnique({
      where: {
        name
      }
    });
    return findProvince;
  }
  async create(data) {
    let newProvince = await prisma.province.create({
      data: {
        name: data.name
      }
    });
    return newProvince;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let provinces = await prisma.province.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return provinces;
  }
  async destroy(id) {
    let findProvince = await prisma.province.delete({
      where: {
        id
      }
    });
    return findProvince ? true : false;
  }
  async findById(id) {
    const province = await prisma.province.findUnique({
      where: {
        id
      }
    });
    return province;
  }
};

// src/repositories/prisma/prisma-county-repository.ts
var PrismaCountyRepository = class {
  async findByName(name) {
    const county = await prisma.county.findFirst({
      where: {
        name
      }
    });
    return county;
  }
  async create(data) {
    let county = await prisma.county.create({
      data: {
        name: data.name
      }
    });
    return county;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let counties = await prisma.county.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return counties;
  }
  async destroy(id) {
    let county = await prisma.county.delete({
      where: {
        id
      }
    });
    return county ? true : false;
  }
  async findById(id) {
    const county = await prisma.county.findUnique({
      where: {
        id
      }
    });
    return county;
  }
};

// src/use-cases/factories/make-student-use-case.ts
function makeStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository();
  const prismaProvinceRepository = new PrismaProvincesRepository();
  const prismaCountyRepository = new PrismaCountyRepository();
  const createStudentUseCase = new CreateStudentUseCase(prismaStudentsRepository, prismaProvinceRepository, prismaCountyRepository);
  return createStudentUseCase;
}

// src/http/controllers/students/create.ts
async function create2(request, reply) {
  const registerBodySchema = import_zod4.z.object({
    fullName: import_zod4.z.string(),
    dateOfBirth: import_zod4.z.coerce.date(),
    emissionDate: import_zod4.z.coerce.date(),
    expirationDate: import_zod4.z.coerce.date(),
    father: import_zod4.z.string(),
    gender: import_zod4.z.enum(["MALE", "FEMALE"]),
    height: import_zod4.z.number(),
    identityCardNumber: import_zod4.z.string(),
    maritalStatus: import_zod4.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    mother: import_zod4.z.string(),
    residence: import_zod4.z.string(),
    phone: import_zod4.z.string(),
    type: import_zod4.z.enum(["SCHOLARSHIP", "REGULAR"]).default("REGULAR"),
    alternativePhone: import_zod4.z.string().optional(),
    provinceId: import_zod4.z.number(),
    countyId: import_zod4.z.number()
  });
  try {
    const {
      alternativePhone,
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
      type
    } = registerBodySchema.parse(request.body);
    const studentUseCase = makeStudentUseCase();
    await studentUseCase.execute({
      alternativePhone,
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
      type
    });
    return reply.status(201).send();
  } catch (err) {
    if (err instanceof PhoneAlreadyExistsError || err instanceof AlternativePhoneAlreadyExistsError || err instanceof ProvinceNotFoundError || err instanceof CountyNotFoundError || err instanceof IdentityCardNumberAlreadyExistsError) {
      return reply.status(409).send({ message: err?.message });
    }
    return reply.status(500).send({ err });
  }
}

// src/http/controllers/students/fetch.ts
var import_zod5 = require("zod");

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

// src/http/controllers/students/fetch.ts
async function fetch(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    query: import_zod5.z.string().optional(),
    page: import_zod5.z.coerce.number().int().positive().optional()
  });
  const { query = "", page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchStudentUseCase = makeFetchStudentUseCase();
    let enrollments = await fetchStudentUseCase.execute({
      query,
      page
    });
    return reply.status(200).send(enrollments);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/http/controllers/students/routes.ts
async function studentsRoutes(app2) {
  app2.post("/students", create2);
  app2.get("/students", fetch);
}

// src/http/controllers/enrollments/create.ts
var import_zod6 = require("zod");

// src/use-cases/errors/student-not-found.ts
var StudentNotFoundError = class extends Error {
  constructor() {
    super("Student not found.");
  }
};

// src/use-cases/errors/course-not-found.ts
var CourseNotFoundError = class extends Error {
  constructor() {
    super("Course not found.");
  }
};

// src/use-cases/errors/level-not-found.ts
var LevelNotFoundError = class extends Error {
  constructor() {
    super("Level not found.");
  }
};

// src/use-cases/errors/enrollment-already-exists.ts
var EnrollmentAlreadyExistsError = class extends Error {
  constructor() {
    super("Enrollment already exists error.");
  }
};

// src/repositories/prisma/prisma-enrollments-repository.ts
var PrismaEnrollmentsRepository = class {
  async checkStatus(enrollmentId) {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      },
      include: {
        students: {
          select: {
            fullName: true,
            id: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return enrollment;
  }
  async findByEnrollmentNumber(enrollmentId) {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      }
    });
    return enrollment;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    let enrollment = await prisma.enrollment.findUnique({
      where: { identityCardNumber },
      include: {
        students: {
          select: {
            fullName: true,
            id: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return enrollment;
  }
  async toggleStatus(enrollmentId, docsState, paymentState) {
    let enrollment = await prisma.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        docsState,
        paymentState
      }
    });
    return {
      ...enrollment,
      docsState: enrollment.docsState,
      paymentState: enrollment.paymentState
    };
  }
  async destroy(enrollmentId) {
    let isDeletedEnrollment = await prisma.enrollment.delete({
      where: {
        id: enrollmentId
      }
    });
    return isDeletedEnrollment ? true : false;
  }
  //TODO: Mudar o retorno de any
  async create(data) {
    let enrollment = await prisma.enrollment.create({
      data: {
        docsState: data.docsState,
        paymentState: data.paymentState,
        identityCardNumber: data.identityCardNumber,
        courseId: data.courseId,
        levelId: data.levelId,
        classeId: data.classeId
      }
    });
    return {
      ...enrollment,
      identityCardNumber: enrollment.identityCardNumber,
      levelId: enrollment.levelId,
      courseId: enrollment.courseId,
      classeId: enrollment.classeId
    };
  }
  async searchMany(paymentState, docsState, page) {
    let pageSize = 20;
    const totalItems = await prisma.enrollment.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let enrollments = await prisma.enrollment.findMany({
      include: {
        students: {
          select: {
            dateOfBirth: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            fullName: true,
            countyId: true,
            alternativePhone: true,
            emissionDate: true,
            expirationDate: true,
            father: true,
            files: true,
            id: true,
            maritalStatus: true,
            mother: true,
            phone: true,
            provinceId: true,
            residence: true,
            type: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        },
        documents: {
          select: {
            id: true,
            File: true
          }
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        docsState,
        paymentState
      }
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: enrollments
    };
  }
};

// src/use-cases/enrollment/create-enrollment.ts
var import_crypto = require("crypto");
var CreateEnrollmentUseCase = class {
  constructor(levelsRepository, coursesRepository, enrollmentRepository, studentRepository) {
    this.levelsRepository = levelsRepository;
    this.coursesRepository = coursesRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.studentRepository = studentRepository;
  }
  async execute({
    id,
    paymentState,
    docsState,
    identityCardNumber,
    levelId,
    courseId,
    created_at,
    update_at
  }) {
    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }
    const level = await this.levelsRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError();
    }
    const student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    if (!student) {
      throw new StudentNotFoundError();
    }
    const existingEnrollment = await this.enrollmentRepository.findByIdentityCardNumber(identityCardNumber);
    if (existingEnrollment) {
      throw new EnrollmentAlreadyExistsError();
    }
    const enrollment = await this.enrollmentRepository.create({
      id: id ?? (0, import_crypto.randomInt)(9999),
      docsState: docsState ?? "PENDING",
      paymentState: paymentState ?? "PENDING",
      identityCardNumber,
      classeId: null,
      courseId,
      levelId,
      created_at: created_at ?? /* @__PURE__ */ new Date(),
      update_at: update_at ?? /* @__PURE__ */ new Date()
    });
    return {
      enrollment
    };
  }
};

// src/repositories/prisma/prisma-level-repository.ts
var PrismaLevelsRepository = class {
  async create(data) {
    let newLevel = await prisma.level.create({
      data: {
        name: data.name
      }
    });
    return newLevel;
  }
  async searchMany() {
    return await prisma.level.findMany();
  }
  async destroy(id) {
    let level = await prisma.level.delete({
      where: {
        id
      }
    });
    return level ? true : false;
  }
  async findById(id) {
    const level = await prisma.level.findUnique({
      where: {
        id
      }
    });
    return level;
  }
};

// src/use-cases/factories/make-enrollment-use-case.ts
function makeCreateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const coursesRepository = new PrismaCoursesRepository();
  const levelsRepository = new PrismaLevelsRepository();
  const studentsRepository = new PrismaStudentsRepository();
  return new CreateEnrollmentUseCase(
    levelsRepository,
    coursesRepository,
    enrollmentsRepository,
    studentsRepository
  );
}

// src/http/controllers/enrollments/create.ts
async function create3(request, reply) {
  const createEnrollmentSchema = import_zod6.z.object({
    identityCardNumber: import_zod6.z.string(),
    courseId: import_zod6.z.number(),
    levelId: import_zod6.z.number()
  });
  const {
    identityCardNumber,
    courseId,
    levelId
  } = createEnrollmentSchema.parse(request.body);
  try {
    const createEnrollmentUseCase = makeCreateEnrollmentUseCase();
    let enrollment = await createEnrollmentUseCase.execute({
      identityCardNumber,
      courseId,
      levelId
    });
    return reply.status(201).send(enrollment);
  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof CourseNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof EnrollmentAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/enrollment/destroy-enrollment.ts
var DestroyEnrollmentUseCase = class {
  constructor(enrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }
  async execute({
    enrollmentId
  }) {
    let enrollment = await this.enrollmentRepository.checkStatus(enrollmentId);
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    return await this.enrollmentRepository.destroy(
      enrollmentId
    );
  }
};

// src/use-cases/factories/make-destroy-enrollment-use-case.ts
function makeDestroyEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository();
  const destroyEnrollmentUseCase = new DestroyEnrollmentUseCase(prismaEnrollmentsRepository);
  return destroyEnrollmentUseCase;
}

// src/http/controllers/enrollments/destroy.ts
var import_zod7 = require("zod");
async function destroy2(request, reply) {
  const registerBodySchema = import_zod7.z.object({
    id: import_zod7.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const enrollmentUseCase = makeDestroyEnrollmentUseCase();
    await enrollmentUseCase.execute({
      enrollmentId: id
    });
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/enrollments/get.ts
var import_zod8 = require("zod");

// src/use-cases/enrollment/get-enrollment.ts
var GetEnrollmentUseCase = class {
  constructor(enrollmentsRepository) {
    this.enrollmentsRepository = enrollmentsRepository;
  }
  async execute({
    enrollmentNumber,
    identityCardNumber
  }) {
    let enrollment = null;
    if (enrollmentNumber != null || enrollmentNumber != void 0) {
      enrollment = await this.enrollmentsRepository.checkStatus(enrollmentNumber);
    }
    if (identityCardNumber != null || identityCardNumber != void 0) {
      enrollment = await this.enrollmentsRepository.findByIdentityCardNumber(identityCardNumber);
    }
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    return {
      enrollment
    };
  }
};

// src/use-cases/factories/make-get-enrollment-use-case.ts
function makeGetEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository();
  const useCase = new GetEnrollmentUseCase(prismaEnrollmentsRepository);
  return useCase;
}

// src/http/controllers/enrollments/get.ts
async function get(request, reply) {
  const createEnrollmentSchema = import_zod8.z.object({
    enrollmentNumber: import_zod8.z.coerce.number().optional(),
    identityCardNumber: import_zod8.z.coerce.string().optional()
  });
  const {
    enrollmentNumber,
    identityCardNumber
  } = createEnrollmentSchema.parse(request.query);
  try {
    const getEnrollmentUseCase = makeGetEnrollmentUseCase();
    let enrollment = await getEnrollmentUseCase.execute({
      enrollmentNumber,
      identityCardNumber
    });
    return reply.status(201).send(enrollment);
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/enrollments/fetch.ts
var import_zod9 = require("zod");

// src/use-cases/enrollment/fetch-enrollment.ts
var FetchEnrollmentUseCase = class {
  constructor(enrollmentsRepository) {
    this.enrollmentsRepository = enrollmentsRepository;
  }
  async execute({
    paymentState,
    docsState,
    page
  }) {
    const enrollments = await this.enrollmentsRepository.searchMany(
      paymentState,
      docsState,
      page
    );
    return { enrollments };
  }
};

// src/use-cases/factories/make-fetch-enrollment-use-case.ts
function makeFetchEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository();
  const useCase = new FetchEnrollmentUseCase(prismaEnrollmentsRepository);
  return useCase;
}

// src/http/controllers/enrollments/fetch.ts
async function fetch2(request, reply) {
  const registerBodySchema = import_zod9.z.object({
    docsState: import_zod9.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    paymentState: import_zod9.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    page: import_zod9.z.coerce.number().int().positive().optional()
  });
  const { paymentState, docsState, page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchEnrollmentUseCase = makeFetchEnrollmentUseCase();
    let enrollments = await fetchEnrollmentUseCase.execute({
      docsState: docsState || "PENDING",
      paymentState: paymentState || "PENDING",
      page
    });
    return reply.status(200).send(enrollments);
  } catch (err) {
    return reply.status(500).send({ err });
  }
}

// src/http/controllers/enrollments/routes.ts
async function enrollmentsRoutes(app2) {
  app2.post("/enrollments", create3);
  app2.get("/enrollments", fetch2);
  app2.delete("/enrollments/:id", destroy2);
  app2.get("/enrollment", get);
}

// src/use-cases/document/create-document-with-files.ts
var CreateDocumentWithFilesUseCase = class {
  constructor(documentRepository, fileRepository, enrollmentRepository) {
    this.documentRepository = documentRepository;
    this.fileRepository = fileRepository;
    this.enrollmentRepository = enrollmentRepository;
  }
  async execute(request) {
    const { enrollmentId, files } = request;
    const findEnrollment = await this.enrollmentRepository.checkStatus(enrollmentId);
    if (findEnrollment === null || !findEnrollment) {
      throw new EnrollmentNotFoundError();
    }
    const document = await this.documentRepository.create({ enrollmentId });
    const createdFiles = await Promise.all(files.map(
      (file) => this.fileRepository.create({
        ...file,
        documentId: document.id,
        identityCardNumber: findEnrollment.identityCardNumber
      })
    ));
    return {
      document,
      files: createdFiles
    };
  }
};

// src/repositories/prisma/prisma-documents-repository.ts
var PrismaDocumentRepository = class {
  findById(fileId) {
    throw new Error("Method not implemented.");
  }
  destroy(fileId) {
    throw new Error("Method not implemented.");
  }
  async create(data) {
    const findDocument = await prisma.document.findFirst({
      where: {
        enrollmentId: data.enrollmentId
      }
    });
    if (findDocument) {
      return await prisma.document.update({
        where: {
          id: findDocument.id
        },
        data: {
          enrollmentId: data.enrollmentId
        }
      });
    }
    const document = await prisma.document.create({
      data: {
        enrollmentId: data.enrollmentId
      }
    });
    return document;
  }
};

// src/repositories/prisma/prisma-files-repository.ts
var PrismaFilesRepository = class {
  async create(data) {
    const findFile = await prisma.file.findFirst({
      where: {
        type: data.type,
        identityCardNumber: data.identityCardNumber
      }
    });
    if (findFile) {
      return await prisma.file.update({
        where: {
          id: findFile.id
        },
        data: {
          name: data.name,
          path: data.path,
          format: data.format,
          type: data.type,
          identityCardNumber: data.identityCardNumber,
          documentId: data.documentId
        }
      });
    }
    const newFile = await prisma.file.create({
      data: {
        name: data.name,
        path: data.path,
        format: data.format,
        type: data.type,
        identityCardNumber: data.identityCardNumber,
        documentId: data.documentId
      }
    });
    return newFile;
  }
  async findById(id) {
    const file = await prisma.file.findUnique({
      where: { id }
    });
    return file;
  }
  async findAllFilesStudentByIdentityCardNumber(identityCardNumber) {
    const files = await prisma.file.findMany({
      where: { identityCardNumber }
    });
    return files;
  }
  async update(id, data) {
    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        ...data
      }
    });
    return updatedFile;
  }
  async destroy(id) {
    await prisma.file.delete({
      where: { id }
    });
  }
};

// src/use-cases/factories/make-document-use-case.ts
function makeCreateDocumentWithFilesUseCase() {
  const prismaDocumentRepository = new PrismaDocumentRepository();
  const prismaFilesRepository = new PrismaFilesRepository();
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository();
  const createDocumentWithFilesUseCase = new CreateDocumentWithFilesUseCase(prismaDocumentRepository, prismaFilesRepository, prismaEnrollmentsRepository);
  return createDocumentWithFilesUseCase;
}

// src/http/controllers/documents/upload.ts
var import_client2 = require("@prisma/client");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_zod10 = require("zod");
var import_util = require("util");
var import_stream = require("stream");
var pump = (0, import_util.promisify)(import_stream.pipeline);
async function upload(request, reply) {
  const fileSchema = import_zod10.z.object({
    name: import_zod10.z.string(),
    format: import_zod10.z.nativeEnum(import_client2.FileFormat),
    type: import_zod10.z.nativeEnum(import_client2.FileType),
    studentId: import_zod10.z.number()
  });
  const createDocumentWithFilesSchema = import_zod10.z.object({
    enrollmentId: import_zod10.z.number(),
    files: import_zod10.z.array(fileSchema).nonempty()
  });
  const uploadDir = import_path.default.join(__dirname, "..", "..", "..", "..", "uploads/enrollments");
  if (!import_fs.default.existsSync(uploadDir)) {
    import_fs.default.mkdirSync(uploadDir, { recursive: true });
  }
  const files = [];
  let enrollmentId;
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf", "application/docx"];
  const parts = request.parts();
  try {
    for await (const part of parts) {
      if (part.type === "file") {
        const { fieldname, filename } = part;
        if (!allowedMimeTypes.includes(part.mimetype)) {
          return reply.status(400).send({ message: "Invalid file type" });
        }
        let fileSize = 0;
        part.file.on("data", (chunk) => {
          fileSize += chunk.length;
          if (fileSize > 5 * 1024 * 1024) {
            part.file.resume();
            return reply.status(400).send({ error: "File size exceeds 2MB limit" });
          }
        });
        const filepath = import_path.default.join(__dirname, "..", "..", "..", "..", "uploads/enrollments", filename);
        await pump(part.file, import_fs.default.createWriteStream(filepath));
        let type;
        switch (fieldname) {
          case "IDENTITY_CARD":
            {
              type = import_client2.FileType.IDENTITY_CARD;
            }
            break;
          case "REPORT_CARD":
            {
              type = import_client2.FileType.REPORT_CARD;
            }
            break;
          case "TUITION_RECEIPT":
            {
              type = import_client2.FileType.TUITION_RECEIPT;
            }
            break;
          default:
            type = import_client2.FileType.IDENTITY_CARD;
        }
        files.push({
          name: filename,
          path: filepath,
          format: import_client2.FileFormat.PDF,
          type
        });
      } else {
        const field = part.value;
        if (part.type === "field" && part.fieldname === "enrollmentId") {
          enrollmentId = parseInt(field, 10);
        }
      }
    }
    if (enrollmentId === void 0) {
      return reply.status(400).send({ message: "enrollmentId is required" });
    }
    const createDocumentWithFilesUseCase = makeCreateDocumentWithFilesUseCase();
    const result = await createDocumentWithFilesUseCase.execute({ enrollmentId, files });
    return reply.status(201).send(result);
  } catch (err) {
    if (err.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.status(413).send({ message: "File size limit exceeded" });
    }
    return reply.status(500).send({ message: "Internal Server Error", error: err });
  }
}

// src/http/controllers/documents/routes.ts
async function documentsRoutes(app2) {
  app2.post("/uploads/enrollments", upload);
}

// src/http/controllers/photos/upload.ts
var import_client3 = require("@prisma/client");
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var import_zod11 = require("zod");
var import_util2 = require("util");
var import_stream2 = require("stream");

// src/use-cases/file/create-file.ts
var CreateFileUseCase = class {
  constructor(filesRepository) {
    this.filesRepository = filesRepository;
  }
  async execute({ name, path: path4, format, type, identityCardNumber, documentId }) {
    const file = await this.filesRepository.create({
      name,
      path: path4,
      format,
      type,
      identityCardNumber,
      documentId
    });
    return file;
  }
};

// src/use-cases/factories/make-file-use-case.ts
function makeCreateFileUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository();
  const createFileUseCase = new CreateFileUseCase(prismaFilesRepository);
  return createFileUseCase;
}

// src/http/controllers/photos/upload.ts
var pump2 = (0, import_util2.promisify)(import_stream2.pipeline);
async function upload2(request, reply) {
  const fileSchema = import_zod11.z.object({
    name: import_zod11.z.string(),
    format: import_zod11.z.nativeEnum(import_client3.FileFormat),
    identityCardNumber: import_zod11.z.string()
  });
  const uploadDir = import_path2.default.join(__dirname, "..", "..", "..", "..", "uploads/photos");
  if (!import_fs2.default.existsSync(uploadDir)) {
    import_fs2.default.mkdirSync(uploadDir, { recursive: true });
  }
  let identityCardNumber;
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const parts = request.parts();
  try {
    let file = null;
    for await (const part of parts) {
      if (part.type === "field") {
        const field = part.value;
        if (part.fieldname === "identityCardNumber") {
          identityCardNumber = field;
        }
      }
      if (part.type === "file") {
        const { filename } = part;
        if (!allowedMimeTypes.includes(part.mimetype)) {
          return reply.status(400).send({ message: "Invalid file type" });
        }
        let fileSize = 0;
        part.file.on("data", (chunk) => {
          fileSize += chunk.length;
          if (fileSize > 5 * 1024 * 1024) {
            part.file.resume();
            return reply.status(400).send({ error: "File size exceeds 5MB limit" });
          }
        });
        const filepath = import_path2.default.join(uploadDir, filename);
        await pump2(part.file, import_fs2.default.createWriteStream(filepath));
        if (identityCardNumber === void 0) {
          return reply.status(400).send({ message: "identityCardNumber is required" });
        }
        file = {
          name: filename,
          path: filepath,
          format: part.mimetype === "image/jpeg" ? import_client3.FileFormat.JPEG : import_client3.FileFormat.PNG,
          type: import_client3.FileType.PHOTO,
          identityCardNumber,
          documentId: null
        };
      }
    }
    if (file === null) {
      return reply.status(400).send({ message: "No file uploaded" });
    }
    const createFileUseCase = makeCreateFileUseCase();
    const result = await createFileUseCase.execute(file);
    return reply.status(201).send(result);
  } catch (err) {
    if (err.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.status(413).send({ message: "File size limit exceeded" });
    }
    return reply.status(500).send({ message: "Internal Server Error", error: err });
  }
}

// src/http/controllers/photos/routes.ts
async function photosRoutes(app2) {
  app2.post("/uploads/photos", upload2);
}

// src/http/controllers/payments/upload.ts
var import_client4 = require("@prisma/client");
var import_path3 = __toESM(require("path"));
var import_fs3 = __toESM(require("fs"));
var import_zod12 = require("zod");
var import_util3 = require("util");
var import_stream3 = require("stream");
var pump3 = (0, import_util3.promisify)(import_stream3.pipeline);
async function payment(request, reply) {
  const fileSchema = import_zod12.z.object({
    name: import_zod12.z.string(),
    format: import_zod12.z.nativeEnum(import_client4.FileFormat),
    type: import_zod12.z.nativeEnum(import_client4.FileType),
    studentId: import_zod12.z.number()
  });
  const createDocumentWithFilesSchema = import_zod12.z.object({
    enrollmentId: import_zod12.z.number(),
    files: import_zod12.z.array(fileSchema).nonempty()
  });
  const uploadDir = import_path3.default.join(__dirname, "..", "..", "..", "..", "uploads/enrollments");
  if (!import_fs3.default.existsSync(uploadDir)) {
    import_fs3.default.mkdirSync(uploadDir, { recursive: true });
  }
  const files = [];
  let enrollmentId;
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf", "application/docx"];
  const parts = request.parts();
  try {
    for await (const part of parts) {
      if (part.type === "file") {
        const { fieldname, filename } = part;
        if (!allowedMimeTypes.includes(part.mimetype)) {
          return reply.status(400).send({ message: "Invalid file type" });
        }
        let fileSize = 0;
        part.file.on("data", (chunk) => {
          fileSize += chunk.length;
          if (fileSize > 5 * 1024 * 1024) {
            part.file.resume();
            return reply.status(400).send({ error: "File size exceeds 2MB limit" });
          }
        });
        const filepath = import_path3.default.join(__dirname, "..", "..", "..", "..", "uploads/enrollments", filename);
        await pump3(part.file, import_fs3.default.createWriteStream(filepath));
        let type;
        switch (fieldname) {
          case "IDENTITY_CARD":
            {
              type = import_client4.FileType.IDENTITY_CARD;
            }
            break;
          case "REPORT_CARD":
            {
              type = import_client4.FileType.REPORT_CARD;
            }
            break;
          case "TUITION_RECEIPT":
            {
              type = import_client4.FileType.TUITION_RECEIPT;
            }
            break;
          default:
            type = import_client4.FileType.IDENTITY_CARD;
        }
        files.push({
          name: filename,
          path: filepath,
          format: import_client4.FileFormat.PDF,
          type
        });
      } else {
        const field = part.value;
        if (part.type === "field" && part.fieldname === "enrollmentId") {
          enrollmentId = parseInt(field, 10);
        }
      }
    }
    if (enrollmentId === void 0) {
      return reply.status(400).send({ message: "enrollmentId is required" });
    }
    const createDocumentWithFilesUseCase = makeCreateDocumentWithFilesUseCase();
    const result = await createDocumentWithFilesUseCase.execute({ enrollmentId, files });
    return reply.status(201).send(result);
  } catch (err) {
    if (err.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.status(413).send({ message: "File size limit exceeded" });
    }
    return reply.status(500).send({ message: "Internal Server Error", error: err });
  }
}

// src/http/controllers/payments/routes.ts
async function paymentsRoutes(app2) {
  app2.post("/payments/enrollments", payment);
}

// src/http/controllers/notes/add-note.ts
var import_zod13 = require("zod");

// src/use-cases/note/add-note.ts
var import_crypto2 = require("crypto");

// src/use-cases/errors/subject-not-found.ts
var SubjectNotFoundError = class extends Error {
  constructor() {
    super("Subject not found.");
  }
};

// src/use-cases/note/add-note.ts
var CreateNoteUseCase = class {
  constructor(notesRepository, enrollmentsRepository, subjectsRepository) {
    this.notesRepository = notesRepository;
    this.enrollmentsRepository = enrollmentsRepository;
    this.subjectsRepository = subjectsRepository;
  }
  async execute({
    pf1 = 0,
    pf2 = 0,
    pft = 0,
    ps1 = 0,
    ps2 = 0,
    pst = 0,
    pt1 = 0,
    pt2 = 0,
    ptt = 0,
    nee = 0,
    resource = 0,
    level,
    enrollmentId,
    subjectId
  }) {
    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId);
    const subject = await this.subjectsRepository.findById(subjectId);
    if (!subject) {
      throw new SubjectNotFoundError();
    }
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    const note = await this.notesRepository.addNote({
      id: (0, import_crypto2.randomInt)(99999),
      pf1,
      pf2,
      pft,
      ps1,
      ps2,
      pst,
      pt1,
      pt2,
      ptt,
      nee,
      resource,
      enrollmentId,
      subjectId,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date(),
      level
    });
    return {
      note
    };
  }
};

// src/repositories/prisma/prisma-note-repository.ts
var import_client5 = require("@prisma/client");
var prisma2 = new import_client5.PrismaClient();
var PrismaNotesRepository = class {
  async addNote(data) {
    const findNote = await prisma2.note.findFirst({
      where: {
        level: data.level,
        enrollmentId: data.enrollmentId,
        subjectId: data.subjectId
      }
    });
    if (!findNote) {
      return await prisma2.note.create({
        data: {
          pf1: data.pf1 ?? 0,
          pf2: data.pf2 ?? 0,
          pft: data.pft ?? 0,
          ps1: data.ps1 ?? 0,
          ps2: data.ps2 ?? 0,
          pst: data.pst ?? 0,
          pt1: data.pt1 ?? 0,
          pt2: data.pt2 ?? 0,
          ptt: data.ptt ?? 0,
          nee: data.nee ?? 0,
          resource: data.resource ?? 0,
          level: data.level,
          enrollmentId: data.enrollmentId,
          subjectId: data.subjectId,
          created_at: data.created_at ?? /* @__PURE__ */ new Date(),
          update_at: /* @__PURE__ */ new Date()
        }
      });
    }
    return await prisma2.note.update({
      where: {
        id: findNote.id
      },
      data: {
        resource: data.resource ?? findNote.resource,
        pf1: data.pf1 ?? findNote.pf1,
        pf2: data.pf2 ?? findNote.pf2,
        pft: data.pft ?? findNote.pft,
        ps1: data.pf1 ?? findNote.ps1,
        ps2: data.pf2 ?? findNote.ps2,
        pst: data.pft ?? findNote.pst,
        pt1: data.pf1 ?? findNote.pt1,
        pt2: data.pf2 ?? findNote.pt2,
        ptt: data.pft ?? findNote.ptt,
        nee: data.nee ?? findNote.nee,
        level: data.level,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async update(id, data) {
    const note = await prisma2.note.update({
      where: { id },
      data: {
        ...data,
        update_at: /* @__PURE__ */ new Date()
      }
    }).catch(() => null);
    return note;
  }
  async destroy(id) {
    try {
      await prisma2.note.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
  async searchMany(criteria) {
    const notes = await prisma2.note.findMany({
      where: criteria
    });
    return notes;
  }
  async getNoteWithFullGrades(criteria) {
    const notes = await prisma2.note.findMany({
      where: {
        enrollmentId: criteria.enrollmentId,
        OR: [
          {
            level: criteria.level,
            subjectId: criteria.subjectId
          }
        ]
      },
      include: {
        enrollments: false,
        // Inclui os dados do estudante
        subjects: true
        // Inclui os dados da disciplina
      }
    });
    if (!notes.length)
      return null;
    return notes;
  }
};

// src/repositories/prisma/prisma-subject-repository.ts
var PrismaSubjectRepository = class {
  async findByName(name) {
    const findSubject = await prisma.subject.findUnique({
      where: {
        name
      }
    });
    return findSubject;
  }
  async create(data) {
    let newSubject = await prisma.subject.create({
      data: {
        name: data.name
      }
    });
    return newSubject;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let courses = await prisma.subject.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return courses;
  }
  async destroy(id) {
    let findSubject = await prisma.subject.delete({
      where: {
        id
      }
    });
    return findSubject ? true : false;
  }
  async findById(id) {
    const subject = await prisma.subject.findUnique({
      where: {
        id
      }
    });
    return subject;
  }
};

// src/use-cases/factories/make-create-note-use-case.ts
function makeCreateNoteUseCase() {
  const notesRepository = new PrismaNotesRepository();
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const subjectsRepository = new PrismaSubjectRepository();
  return new CreateNoteUseCase(notesRepository, enrollmentsRepository, subjectsRepository);
}

// src/use-cases/errors/note-already-exists-error.ts
var NoteAlreadyExistsError = class extends Error {
  constructor() {
    super("Note already exists.");
  }
};

// src/http/controllers/notes/add-note.ts
async function create4(request, reply) {
  const createNoteBodySchema = import_zod13.z.object({
    pf1: import_zod13.z.number().default(0),
    pf2: import_zod13.z.number().default(0),
    pft: import_zod13.z.number().default(0),
    ps1: import_zod13.z.number().default(0),
    ps2: import_zod13.z.number().default(0),
    pst: import_zod13.z.number().default(0),
    pt1: import_zod13.z.number().default(0),
    pt2: import_zod13.z.number().default(0),
    ptt: import_zod13.z.number().default(0),
    nee: import_zod13.z.number().default(0),
    resource: import_zod13.z.number().optional(),
    level: import_zod13.z.enum(["CLASS_10", "CLASS_11", "CLASS_12", "CLASS_13"]),
    enrollmentId: import_zod13.z.number(),
    subjectId: import_zod13.z.number()
  });
  const { pf1, nee, pf2, pft, ps1, ps2, pst, pt1, pt2, ptt, resource, level, enrollmentId, subjectId } = createNoteBodySchema.parse(request.body);
  try {
    console.log("1111");
    const createNoteUseCase = makeCreateNoteUseCase();
    const { note } = await createNoteUseCase.execute({
      pf1,
      nee,
      pf2,
      pft,
      ps1,
      ps2,
      pst,
      pt1,
      pt2,
      ptt,
      resource,
      level,
      enrollmentId,
      subjectId
    });
    return reply.status(200).send(note);
  } catch (err) {
    if (err instanceof NoteAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof SubjectNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    console.log(err);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

// src/use-cases/note/search-many.ts
var SearchManyNotesUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    p1,
    p2,
    exam,
    nee,
    resource,
    mester,
    studentId,
    subjectId
  }) {
    const criteria = {
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      studentId,
      subjectId
    };
    const notes = await this.notesRepository.searchMany(criteria);
    return {
      notes
    };
  }
};

// src/use-cases/factories/make-search-many-notes-use-case.ts
function makeSearchManyNotesUseCase() {
  const notesRepository = new PrismaNotesRepository();
  return new SearchManyNotesUseCase(notesRepository);
}

// src/http/controllers/notes/search-many.ts
var import_zod14 = require("zod");
async function searchMany(request, reply) {
  const searchManyBodySchema = import_zod14.z.object({
    studentId: import_zod14.z.number().optional(),
    subjectId: import_zod14.z.number().optional(),
    mester: import_zod14.z.enum(["FIRST", "SECOND", "THIRD"]).optional(),
    level: import_zod14.z.enum(["CLASS_10", "CLASS_11", "CLASS_12", "CLASS_13"]).optional()
  });
  const criteria = searchManyBodySchema.parse(request.query);
  try {
    const searchManyNotesUseCase = makeSearchManyNotesUseCase();
    const notes = await searchManyNotesUseCase.execute(criteria);
    return reply.status(200).send({ notes });
  } catch (err) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

// src/use-cases/note/get-notes-with-grades.ts
var GetNoteWithGradesUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute(criteria) {
    const note = await this.notesRepository.getNoteWithFullGrades(criteria);
    return {
      note
    };
  }
};

// src/use-cases/factories/make-get-note-with-full-grades-use-case.ts
function makeGetNoteWithFullGradesUseCase() {
  const notesRepository = new PrismaNotesRepository();
  return new GetNoteWithGradesUseCase(notesRepository);
}

// src/http/controllers/notes/get-note-with-full-grades.ts
var import_client6 = require("@prisma/client");
var import_zod15 = require("zod");
async function getNoteWithFullGrades(request, reply) {
  const getNoteWithFullGradesParamsSchema = import_zod15.z.object({
    enrollmentId: import_zod15.z.coerce.number()
  });
  const getNoteWithFullGradesQueriesSchema = import_zod15.z.object({
    level: import_zod15.z.nativeEnum(import_client6.LevelName).optional(),
    // Use z.nativeEnum para enums
    resource: import_zod15.z.coerce.number().optional(),
    // Use z.nativeEnum para enums
    subjectId: import_zod15.z.coerce.number().optional()
    // Use z.nativeEnum para enums
  });
  const { level, subjectId } = getNoteWithFullGradesQueriesSchema.parse(request.query);
  const { enrollmentId } = getNoteWithFullGradesParamsSchema.parse(request.params);
  try {
    const getNoteWithFullGradesUseCase = makeGetNoteWithFullGradesUseCase();
    const { note } = await getNoteWithFullGradesUseCase.execute({
      enrollmentId,
      level,
      subjectId
    });
    return reply.status(200).send({
      notes: note
    });
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

// src/http/controllers/notes/routes.ts
async function notesRoutes(app2) {
  app2.post("/notes", create4);
  app2.get("/notes/search", searchMany);
  app2.get("/notes/:enrollmentId/grades", getNoteWithFullGrades);
}

// src/http/controllers/auth/login.ts
var import_zod16 = require("zod");

// src/use-cases/authenticate/authenticate.ts
var import_client7 = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var LoginUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
    this.jwtSecret = process.env.JWT_SECRET;
    // Use uma variável de ambiente para o segredo
    this.ATTEMPT_LIMIT = 5;
  }
  async execute({ email, password }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    const passwordMatches = await import_bcryptjs.default.compare(password, user.password);
    if (!passwordMatches) {
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);
      await this.usersRepository.logAccess(user.id, import_client7.AccessStatus.FAILURE);
      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id);
        return {
          success: false,
          message: "Account blocked due to multiple failed login attempts."
        };
      }
      return {
        success: false,
        message: "Invalid credentials."
      };
    }
    if (user.isBlocked) {
      return {
        success: false,
        message: "Account is blocked. Please contact support."
      };
    }
    await this.usersRepository.updateLoginAttempt(user.id, 0);
    await this.usersRepository.logAccess(user.id, import_client7.AccessStatus.SUCCESS);
    const token = import_jsonwebtoken.default.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: "1h" }
      // Token expira em 1 hora
    );
    return {
      success: true,
      message: "Login successful",
      userId: user.id,
      role: user.role,
      token
    };
  }
};

// src/repositories/prisma/prisma-user-repository.ts
var import_client8 = require("@prisma/client");
var PrismaUserRepository = class {
  constructor() {
    this.prisma = new import_client8.PrismaClient();
  }
  async findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date(),
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
        // EmployeeId and StudentId should be handled if needed
      }
    });
  }
  async updateLoginAttempt(id, attempts) {
    await this.prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async blockUser(id) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isBlocked: true,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async logAccess(userId, status) {
    await this.prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/http/controllers/auth/login.ts
async function loginController(request, reply) {
  const loginSchema = import_zod16.z.object({
    email: import_zod16.z.string().email(),
    password: import_zod16.z.string().min(6)
    // Definindo uma mínima de 6 caracteres para a senha
  });
  const { email, password } = loginSchema.parse(request.body);
  const usersRepository = new PrismaUserRepository();
  const loginUseCase = new LoginUseCase(usersRepository);
  try {
    const result = await loginUseCase.execute({ email, password });
    if (result.success) {
      return reply.status(200).send({
        success: result.success,
        message: result.message,
        userId: result.userId,
        role: result.role,
        token: result.token
      });
    } else {
      return reply.status(400).send({
        success: result.success,
        message: result.message
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// src/http/middlewares/verify-user-role.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function accessControlMiddleware(requiredRole) {
  return async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ message: "Unauthorized: No token provided" });
      }
      const token = authHeader.replace("Bearer ", "");
      const secretKey = process.env.JWT_SECRET;
      let decodedToken;
      try {
        decodedToken = (0, import_jsonwebtoken2.verify)(token, secretKey);
      } catch (error) {
        return reply.status(401).send({ message: "Unauthorized: Invalid token" });
      }
      const { userId, role } = decodedToken;
      const usersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);
      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: "Unauthorized: User is blocked or inactive" });
      }
      if (user.role !== requiredRole) {
        return reply.status(403).send({ message: "Forbidden: Access denied" });
      }
      request.user = user;
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  };
}

// src/http/controllers/auth/routes.ts
var import_client9 = require("@prisma/client");

// src/http/controllers/auth/register.ts
var import_zod17 = require("zod");

// src/use-cases/authenticate/register.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken3 = require("jsonwebtoken");
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({ email, password, role, employeeId, studentId }) {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use"
      };
    }
    const hashedPassword = await import_bcryptjs2.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId
    });
    const token = (0, import_jsonwebtoken3.sign)(
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

// src/http/controllers/auth/register.ts
async function registerController(request, reply) {
  const registerSchema = import_zod17.z.object({
    email: import_zod17.z.string().email(),
    password: import_zod17.z.string().min(6),
    // Definindo uma senha com no mínimo 6 caracteres
    role: import_zod17.z.enum(["STUDENT", "ADMIN", "TEACHER"])
    // Adicionando um enum para o papel do usuário
  });
  const { email, password, role } = registerSchema.parse(request.body);
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  try {
    const result = await registerUseCase.execute({ email, password, role });
    if (result.success) {
      return reply.status(201).send({
        success: result.success,
        message: result.message,
        userId: result.userId,
        token: result.token
      });
    } else {
      return reply.status(400).send({
        success: result.success,
        message: result.message
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// src/http/controllers/auth/routes.ts
async function authRoutes(app2) {
  app2.post("/auth", loginController);
  app2.post("/signup", registerController);
  app2.get("/admin-data", { preHandler: accessControlMiddleware(import_client9.Role.ADMIN) }, async (request, reply) => {
    return reply.send({ message: "Admin data" });
  });
  app2.get("/user-data", { preHandler: accessControlMiddleware(import_client9.Role.STUDENT) }, async (request, reply) => {
    return reply.send({ message: "STUDENT data" });
  });
}

// src/app.ts
var import_multipart = __toESM(require("@fastify/multipart"));
var app = (0, import_fastify.default)();
app.register(require("@fastify/cors"), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };
    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false;
    }
    callback(null, corsOptions);
  };
});
app.register(import_multipart.default, {
  limits: {
    fileSize: 5 * 1024 * 1024
    // 2MB
  }
});
app.register(import_cookie.default);
app.register(coursesRoutes, { prefix: "/api/v1" });
app.register(studentsRoutes, { prefix: "/api/v1" });
app.register(enrollmentsRoutes, { prefix: "/api/v1" });
app.register(documentsRoutes, { prefix: "/api/v1" });
app.register(photosRoutes, { prefix: "/api/v1" });
app.register(paymentsRoutes, { prefix: "/api/v1" });
app.register(notesRoutes, { prefix: "/api/v1" });
app.register(authRoutes, { prefix: "/api/v1" });
app.setErrorHandler((error, _, reply) => {
  if (error instanceof import_zod18.ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
  return reply.status(500).send({ message: "Internal server error." });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
