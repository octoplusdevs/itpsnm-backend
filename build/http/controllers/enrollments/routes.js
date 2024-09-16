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

// src/http/controllers/enrollments/routes.ts
var routes_exports = {};
__export(routes_exports, {
  enrollmentsRoutes: () => enrollmentsRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/enrollments/create.ts
var import_zod = require("zod");

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
async function create(request, reply) {
  const createEnrollmentSchema = import_zod.z.object({
    identityCardNumber: import_zod.z.string(),
    courseId: import_zod.z.number(),
    levelId: import_zod.z.number()
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
var import_zod2 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    id: import_zod2.z.coerce.number()
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
var import_zod3 = require("zod");

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

// src/use-cases/errors/resource-not-found.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found.");
  }
};

// src/http/controllers/enrollments/get.ts
async function get(request, reply) {
  const createEnrollmentSchema = import_zod3.z.object({
    enrollmentNumber: import_zod3.z.coerce.number().optional(),
    identityCardNumber: import_zod3.z.coerce.string().optional()
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
var import_zod4 = require("zod");

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
async function fetch(request, reply) {
  const registerBodySchema = import_zod4.z.object({
    docsState: import_zod4.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    paymentState: import_zod4.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    page: import_zod4.z.coerce.number().int().positive().optional()
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
async function enrollmentsRoutes(app) {
  app.post("/enrollments", create);
  app.get("/enrollments", fetch);
  app.delete("/enrollments/:id", destroy);
  app.get("/enrollment", get);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  enrollmentsRoutes
});
