"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));
var import_zod35 = require("zod");

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
    const findCourse = await this.coursesRepository.findByName(name);
    if (findCourse) {
      throw new CourseAlreadyExistsError();
    }
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
  log: env.NODE_ENV === "dev" ? ["query", "info", "warn", "error"] : []
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

// src/use-cases/errors/course-not-found.ts
var CourseNotFoundError = class extends Error {
  constructor() {
    super("Course not found.");
  }
};

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
    const findCourse = await this.coursesRepository.findById(id);
    if (!findCourse) {
      throw new CourseNotFoundError();
    }
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
    if (err instanceof CourseNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/courses/fetch.ts
var import_zod4 = require("zod");

// src/use-cases/course/fetch-course.ts
var FetchCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    name,
    page
  }) {
    const courses = await this.coursesRepository.searchMany(
      name,
      page
    );
    return {
      courses
    };
  }
};

// src/use-cases/factories/make-fetch-course-use-case.ts
function makeFetchCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const fetchCourseUseCase = new FetchCourseUseCase(prismaCoursesRepository);
  return fetchCourseUseCase;
}

// src/http/controllers/courses/fetch.ts
async function fetch(request, reply) {
  const registerBodySchema = import_zod4.z.object({
    query: import_zod4.z.string().optional(),
    page: import_zod4.z.coerce.number().int().positive().optional()
  });
  const { query = "", page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchCourseUseCase = makeFetchCourseUseCase();
    let enrollments = await fetchCourseUseCase.execute({
      name: query,
      page
    });
    return reply.status(200).send(enrollments);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/course/get-course.ts
var GetCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    courseId
  }) {
    const course = await this.coursesRepository.findById(
      courseId
    );
    if (!course) {
      throw new CourseNotFoundError();
    }
    return {
      course
    };
  }
};

// src/use-cases/factories/make-get-course-use-case.ts
function makeGetCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const getCourseUseCase = new GetCourseUseCase(prismaCoursesRepository);
  return getCourseUseCase;
}

// src/http/controllers/courses/get.ts
var import_zod5 = require("zod");
async function get(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    id: import_zod5.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const getCourseUseCase = makeGetCourseUseCase();
    const course = await getCourseUseCase.execute({
      courseId: id
    });
    return reply.send(course);
  } catch (err) {
    if (err instanceof CourseNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/courses/routes.ts
async function coursesRoutes(app2) {
  app2.post("/courses", create);
  app2.get("/courses", fetch);
  app2.delete("/courses/:id", destroy);
  app2.get("/courses/:id", get);
}

// src/http/controllers/students/create.ts
var import_zod6 = require("zod");

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
  const registerBodySchema = import_zod6.z.object({
    fullName: import_zod6.z.string(),
    dateOfBirth: import_zod6.z.coerce.date(),
    emissionDate: import_zod6.z.coerce.date(),
    expirationDate: import_zod6.z.coerce.date(),
    father: import_zod6.z.string(),
    gender: import_zod6.z.enum(["MALE", "FEMALE"]),
    height: import_zod6.z.number(),
    identityCardNumber: import_zod6.z.string(),
    maritalStatus: import_zod6.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    mother: import_zod6.z.string(),
    residence: import_zod6.z.string(),
    phone: import_zod6.z.string(),
    type: import_zod6.z.enum(["SCHOLARSHIP", "REGULAR"]).default("REGULAR"),
    alternativePhone: import_zod6.z.string().optional(),
    provinceId: import_zod6.z.number(),
    countyId: import_zod6.z.number()
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
var import_zod7 = require("zod");

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
async function fetch2(request, reply) {
  const registerBodySchema = import_zod7.z.object({
    query: import_zod7.z.string().optional(),
    page: import_zod7.z.coerce.number().int().positive().optional()
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
  app2.get("/students", fetch2);
}

// src/http/controllers/enrollments/create.ts
var import_zod8 = require("zod");

// src/use-cases/errors/student-not-found.ts
var StudentNotFoundError = class extends Error {
  constructor() {
    super("Student not found.");
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
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
  const createEnrollmentSchema = import_zod8.z.object({
    identityCardNumber: import_zod8.z.string(),
    courseId: import_zod8.z.number(),
    levelId: import_zod8.z.number()
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
var import_zod9 = require("zod");
async function destroy2(request, reply) {
  const registerBodySchema = import_zod9.z.object({
    id: import_zod9.z.coerce.number()
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
var import_zod10 = require("zod");

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
async function get2(request, reply) {
  const createEnrollmentSchema = import_zod10.z.object({
    enrollmentNumber: import_zod10.z.coerce.number().optional(),
    identityCardNumber: import_zod10.z.coerce.string().optional()
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
var import_zod11 = require("zod");

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
async function fetch3(request, reply) {
  const registerBodySchema = import_zod11.z.object({
    docsState: import_zod11.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    paymentState: import_zod11.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    page: import_zod11.z.coerce.number().int().positive().optional()
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
  app2.get("/enrollments/all", fetch3);
  app2.delete("/enrollments/:id", destroy2);
  app2.get("/enrollments", get2);
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
var import_zod12 = require("zod");
var import_util = require("util");
var import_stream = require("stream");
var pump = (0, import_util.promisify)(import_stream.pipeline);
async function upload(request, reply) {
  const fileSchema = import_zod12.z.object({
    name: import_zod12.z.string(),
    format: import_zod12.z.nativeEnum(import_client2.FileFormat),
    type: import_zod12.z.nativeEnum(import_client2.FileType),
    studentId: import_zod12.z.number()
  });
  const createDocumentWithFilesSchema = import_zod12.z.object({
    enrollmentId: import_zod12.z.number(),
    files: import_zod12.z.array(fileSchema).nonempty()
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
var import_zod13 = require("zod");
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
  const fileSchema = import_zod13.z.object({
    name: import_zod13.z.string(),
    format: import_zod13.z.nativeEnum(import_client3.FileFormat),
    identityCardNumber: import_zod13.z.string()
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
var import_zod14 = require("zod");
var import_util3 = require("util");
var import_stream3 = require("stream");
var pump3 = (0, import_util3.promisify)(import_stream3.pipeline);
async function payment(request, reply) {
  const fileSchema = import_zod14.z.object({
    name: import_zod14.z.string(),
    format: import_zod14.z.nativeEnum(import_client4.FileFormat),
    type: import_zod14.z.nativeEnum(import_client4.FileType),
    studentId: import_zod14.z.number()
  });
  const createDocumentWithFilesSchema = import_zod14.z.object({
    enrollmentId: import_zod14.z.number(),
    files: import_zod14.z.array(fileSchema).nonempty()
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
var import_zod15 = require("zod");

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
var PrismaNotesRepository = class {
  async addNote(data) {
    const findNote = await prisma.note.findFirst({
      where: {
        level: data.level,
        enrollmentId: data.enrollmentId,
        subjectId: data.subjectId
      }
    });
    if (!findNote) {
      const newNote = await prisma.note.create({
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
      return newNote;
    }
    const updated = await prisma.note.update({
      where: {
        id: findNote.id
      },
      data: {
        resource: data.resource ?? findNote.resource,
        pf1: data.pf1 ?? findNote.pf1,
        pf2: data.pf2 ?? findNote.pf2,
        pft: data.pft ?? findNote.pft,
        ps1: data.ps1 ?? findNote.ps1,
        ps2: data.ps2 ?? findNote.ps2,
        pst: data.pst ?? findNote.pst,
        pt1: data.pt1 ?? findNote.pt1,
        pt2: data.pt2 ?? findNote.pt2,
        ptt: data.ptt ?? findNote.ptt,
        nee: data.nee ?? findNote.nee,
        level: data.level,
        update_at: /* @__PURE__ */ new Date()
      }
    });
    return updated;
  }
  async update(id, data) {
    const note = await prisma.note.update({
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
      await prisma.note.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
  async searchMany(criteria) {
    const notes = await prisma.note.findMany({
      where: criteria
    });
    return notes;
  }
  async getNoteWithFullGrades(criteria) {
    const notes = await prisma.note.findMany({
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
  const createNoteBodySchema = import_zod15.z.object({
    pf1: import_zod15.z.number().optional(),
    pf2: import_zod15.z.number().optional(),
    pft: import_zod15.z.number().optional(),
    ps1: import_zod15.z.number().optional(),
    ps2: import_zod15.z.number().optional(),
    pst: import_zod15.z.number().optional(),
    pt1: import_zod15.z.number().optional(),
    pt2: import_zod15.z.number().optional(),
    ptt: import_zod15.z.number().optional(),
    nee: import_zod15.z.number().optional(),
    resource: import_zod15.z.number().optional(),
    level: import_zod15.z.enum(["CLASS_10", "CLASS_11", "CLASS_12", "CLASS_13"]),
    enrollmentId: import_zod15.z.number(),
    subjectId: import_zod15.z.number()
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
var import_zod16 = require("zod");
async function searchMany(request, reply) {
  const searchManyBodySchema = import_zod16.z.object({
    studentId: import_zod16.z.number().optional(),
    subjectId: import_zod16.z.number().optional(),
    mester: import_zod16.z.enum(["FIRST", "SECOND", "THIRD"]).optional(),
    level: import_zod16.z.enum(["CLASS_10", "CLASS_11", "CLASS_12", "CLASS_13"]).optional()
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
var import_client5 = require("@prisma/client");
var import_zod17 = require("zod");
async function getNoteWithFullGrades(request, reply) {
  const getNoteWithFullGradesParamsSchema = import_zod17.z.object({
    enrollmentId: import_zod17.z.coerce.number()
  });
  const getNoteWithFullGradesQueriesSchema = import_zod17.z.object({
    level: import_zod17.z.nativeEnum(import_client5.LevelName).optional(),
    // Use z.nativeEnum para enums
    resource: import_zod17.z.coerce.number().optional(),
    // Use z.nativeEnum para enums
    subjectId: import_zod17.z.coerce.number().optional()
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

// src/http/middlewares/verify-user-role.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/repositories/prisma/prisma-user-repository.ts
var PrismaUserRepository = class {
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        password: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        studentId: true
      }
    });
  }
  async searchMany(role, page) {
    let pageSize = 20;
    const totalItems = await prisma.user.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        role
      },
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        studentId: true
      }
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: users
    };
  }
  async create(data) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        employeeId: data.employeeId,
        studentId: data.studentId,
        lastLogin: /* @__PURE__ */ new Date(),
        created_at: /* @__PURE__ */ new Date(),
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async updateLoginAttempt(id, attempts) {
    await prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async resetUserPassword(id, password) {
    await prisma.user.update({
      where: { id },
      data: {
        password,
        loginAttempt: 0,
        isBlocked: false,
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async blockUser(id, status) {
    await prisma.user.update({
      where: { id },
      data: {
        isBlocked: Boolean(status),
        update_at: /* @__PURE__ */ new Date()
      }
    });
  }
  async logAccess(userId, status) {
    await prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
  }
};

// src/http/middlewares/verify-user-role.ts
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
        decodedToken = (0, import_jsonwebtoken.verify)(token, secretKey);
      } catch (error) {
        return reply.status(401).send({ message: "Unauthorized: Invalid token" });
      }
      const { userId } = decodedToken;
      const usersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);
      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: "Unauthorized: User is blocked or inactive" });
      }
      if (!requiredRole.includes(user.role)) {
        return reply.status(403).send({ message: "Forbidden: Access denied" });
      }
      request.user = user;
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  };
}

// src/http/controllers/notes/routes.ts
var import_client6 = require("@prisma/client");
async function notesRoutes(app2) {
  app2.post("/notes", { preHandler: accessControlMiddleware([import_client6.Role.ADMIN, import_client6.Role.TEACHER]) }, create4);
  app2.get("/notes/search", { preHandler: accessControlMiddleware([import_client6.Role.ADMIN, import_client6.Role.TEACHER, import_client6.Role.STUDENT]) }, searchMany);
  app2.get("/notes/:enrollmentId/grades", { preHandler: accessControlMiddleware([import_client6.Role.ADMIN, import_client6.Role.TEACHER, import_client6.Role.STUDENT]) }, getNoteWithFullGrades);
}

// src/http/controllers/auth/login.ts
var import_zod18 = require("zod");

// src/use-cases/authenticate/authenticate.ts
var import_client7 = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var LoginUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
    this.jwtSecret = process.env.JWT_SECRET;
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
    console.log({
      password,
      t: user
    });
    const passwordMatches = await import_bcryptjs.default.compare(password, user.password);
    if (!passwordMatches) {
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);
      await this.usersRepository.logAccess(user.id, import_client7.AccessStatus.FAILURE);
      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id, true);
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
    if (!user.isActive) {
      return {
        success: false,
        message: "Account is not active. Please contact support."
      };
    }
    await this.usersRepository.updateLoginAttempt(user.id, 0);
    await this.usersRepository.logAccess(user.id, import_client7.AccessStatus.SUCCESS);
    const token = import_jsonwebtoken2.default.sign(
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

// src/http/controllers/auth/login.ts
async function loginController(request, reply) {
  const loginSchema = import_zod18.z.object({
    email: import_zod18.z.string().email(),
    password: import_zod18.z.string().min(6)
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

// src/http/controllers/auth/routes.ts
var import_client8 = require("@prisma/client");

// src/http/controllers/auth/register.ts
var import_zod19 = require("zod");

// src/use-cases/authenticate/register.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken3 = require("jsonwebtoken");

// src/use-cases/errors/employee-not-found.ts
var EmployeeNotFoundError = class extends Error {
  constructor() {
    super("Employee not found.");
  }
};

// src/use-cases/errors/employee-student-not-found.ts
var EmployeeOREnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Employee or Enrollment not found.");
  }
};

// src/use-cases/authenticate/register.ts
var RegisterUseCase = class {
  constructor(usersRepository, enrollmentRepository, employeesRepository) {
    this.usersRepository = usersRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.employeesRepository = employeesRepository;
  }
  async execute({ email, password, role, employeeId, enrollmentId }) {
    if (!employeeId && !enrollmentId) {
      throw new EmployeeOREnrollmentNotFoundError();
    }
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use"
      };
    }
    let existingStudent = null;
    if (enrollmentId !== null && enrollmentId != void 0) {
      existingStudent = await this.enrollmentRepository.checkStatus(enrollmentId);
      if (!existingStudent) {
        throw new EnrollmentNotFoundError();
      }
    }
    if (employeeId !== null && employeeId != void 0) {
      const existingEmployeeId = await this.employeesRepository.findById(employeeId);
      if (!existingEmployeeId) {
        throw new EmployeeNotFoundError();
      }
    }
    const hashedPassword = await import_bcryptjs2.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId: existingStudent?.id
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

// src/http/controllers/auth/register.ts
async function registerController(request, reply) {
  const registerSchema = import_zod19.z.object({
    email: import_zod19.z.string().email(),
    employeeId: import_zod19.z.number().optional(),
    enrollmentId: import_zod19.z.number().optional(),
    password: import_zod19.z.string().min(6),
    // Definindo uma senha com no mínimo 6 caracteres
    role: import_zod19.z.enum(["STUDENT", "ADMIN", "TEACHER"])
    // Adicionando um enum para o papel do usuário
  });
  const { email, password, role, employeeId, enrollmentId } = registerSchema.parse(request.body);
  const usersRepository = new PrismaUserRepository();
  const employeeRepository = new PrismaEmployeeRepository();
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const registerUseCase = new RegisterUseCase(usersRepository, enrollmentsRepository, employeeRepository);
  try {
    const result = await registerUseCase.execute({ email, password, role, employeeId, enrollmentId });
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
  } catch (err) {
    if (err instanceof EmployeeOREnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof EmployeeNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
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
  app2.get("/admin-data", { preHandler: accessControlMiddleware([import_client8.Role.ADMIN, import_client8.Role.TEACHER]) }, async (request, reply) => {
    return reply.send({ message: "Admin data" });
  });
  app2.get("/user-data", { preHandler: accessControlMiddleware([import_client8.Role.STUDENT]) }, async (request, reply) => {
    return reply.send({ message: "STUDENT data", user: request.user });
  });
}

// src/use-cases/errors/province-already-exists-error.ts
var ProvinceAlreadyExistsError = class extends Error {
  constructor() {
    super("Province already exists.");
  }
};

// src/use-cases/province/create-province.ts
var CreateProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    name
  }) {
    const findProvince = await this.provincesRepository.findByName(name);
    if (findProvince) {
      throw new ProvinceAlreadyExistsError();
    }
    const province = await this.provincesRepository.create({
      name
    });
    return {
      province
    };
  }
};

// src/use-cases/factories/make-province-use-case.ts
function makeProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository();
  const createProvinceUseCase = new CreateProvinceUseCase(prismaProvincesRepository);
  return createProvinceUseCase;
}

// src/http/controllers/provinces/create.ts
var import_zod20 = require("zod");
async function create5(request, reply) {
  const registerBodySchema = import_zod20.z.object({
    name: import_zod20.z.string()
  });
  const { name } = registerBodySchema.parse(request.body);
  try {
    const provinceUseCase = makeProvinceUseCase();
    await provinceUseCase.execute({
      name
    });
  } catch (err) {
    if (err instanceof ProvinceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/province/destroy-province.ts
var DestroyProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    id
  }) {
    let findProvince = await this.provincesRepository.findById(id);
    if (!findProvince) {
      throw new ProvinceNotFoundError();
    }
    return await this.provincesRepository.destroy(
      id
    );
  }
};

// src/use-cases/factories/make-destroy-province-use-case.ts
function makeDestroyProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository();
  const destroyProvinceUseCase = new DestroyProvinceUseCase(prismaProvincesRepository);
  return destroyProvinceUseCase;
}

// src/http/controllers/provinces/destroy.ts
var import_zod21 = require("zod");
async function destroy3(request, reply) {
  const registerBodySchema = import_zod21.z.object({
    id: import_zod21.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const provinceUseCase = makeDestroyProvinceUseCase();
    await provinceUseCase.execute({
      id
    });
  } catch (err) {
    if (err instanceof ProvinceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/provinces/fetch.ts
var import_zod22 = require("zod");

// src/use-cases/province/fetch-province.ts
var FetchProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    name,
    page
  }) {
    const provinces = await this.provincesRepository.searchMany(
      name,
      page
    );
    return {
      provinces
    };
  }
};

// src/use-cases/factories/make-fetch-province-use-case.ts
function makeFetchProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository();
  const fetchProvinceUseCase = new FetchProvinceUseCase(prismaProvincesRepository);
  return fetchProvinceUseCase;
}

// src/http/controllers/provinces/fetch.ts
async function fetch4(request, reply) {
  const registerBodySchema = import_zod22.z.object({
    query: import_zod22.z.string().optional(),
    page: import_zod22.z.coerce.number().int().positive().optional()
  });
  const { query = "", page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchProvinceUseCase = makeFetchProvinceUseCase();
    let provinces = await fetchProvinceUseCase.execute({
      name: query,
      page
    });
    return reply.status(200).send(provinces);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/province/get-province.ts
var GetProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    provinceId
  }) {
    const province = await this.provincesRepository.findById(
      provinceId
    );
    if (!province) {
      throw new ProvinceNotFoundError();
    }
    return {
      province
    };
  }
};

// src/use-cases/factories/make-get-province-use-case.ts
function makeGetProvinceUseCase() {
  const prismaProvinceRepository = new PrismaProvincesRepository();
  const getProvinceUseCase = new GetProvinceUseCase(prismaProvinceRepository);
  return getProvinceUseCase;
}

// src/http/controllers/provinces/get.ts
var import_zod23 = require("zod");
async function get3(request, reply) {
  const registerBodySchema = import_zod23.z.object({
    id: import_zod23.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const getProvinceUseCase = makeGetProvinceUseCase();
    const province = await getProvinceUseCase.execute({
      provinceId: id
    });
    return reply.send(province);
  } catch (err) {
    if (err instanceof ProvinceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/provinces/routes.ts
async function provincesRoutes(app2) {
  app2.post("/provinces", create5);
  app2.get("/provinces", fetch4);
  app2.delete("/provinces/:id", destroy3);
  app2.get("/provinces/:id", get3);
}

// src/use-cases/errors/county-already-exists-error.ts
var CountyAlreadyExistsError = class extends Error {
  constructor() {
    super("County already exists.");
  }
};

// src/use-cases/county/create-county.ts
var CreateCountyUseCase = class {
  constructor(countyRepository) {
    this.countyRepository = countyRepository;
  }
  async execute({
    name
  }) {
    const findCounty = await this.countyRepository.findByName(name);
    if (findCounty) {
      throw new CountyAlreadyExistsError();
    }
    const province = await this.countyRepository.create({
      name
    });
    return {
      province
    };
  }
};

// src/use-cases/factories/make-county-use-case.ts
function makeCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository();
  const createCountyUseCase = new CreateCountyUseCase(prismaCountyRepository);
  return createCountyUseCase;
}

// src/http/controllers/counties/create.ts
var import_zod24 = require("zod");
async function create6(request, reply) {
  const registerBodySchema = import_zod24.z.object({
    name: import_zod24.z.string()
  });
  const { name } = registerBodySchema.parse(request.body);
  try {
    const countyUseCase = makeCountyUseCase();
    await countyUseCase.execute({
      name
    });
  } catch (err) {
    if (err instanceof CountyAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/county/destroy-county.ts
var DestroyCountyUseCase = class {
  constructor(countiesRepository) {
    this.countiesRepository = countiesRepository;
  }
  async execute({
    id
  }) {
    let findCounty = await this.countiesRepository.findById(id);
    if (!findCounty) {
      throw new CountyNotFoundError();
    }
    return await this.countiesRepository.destroy(
      id
    );
  }
};

// src/use-cases/factories/make-destroy-county-use-case.ts
function makeDestroyCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository();
  const destroyCountyUseCase = new DestroyCountyUseCase(prismaCountyRepository);
  return destroyCountyUseCase;
}

// src/http/controllers/counties/destroy.ts
var import_zod25 = require("zod");
async function destroy4(request, reply) {
  const registerBodySchema = import_zod25.z.object({
    id: import_zod25.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const countyDestroyUseCase = makeDestroyCountyUseCase();
    await countyDestroyUseCase.execute({
      id
    });
  } catch (err) {
    if (err instanceof CountyNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/http/controllers/counties/fetch.ts
var import_zod26 = require("zod");

// src/use-cases/county/fetch-county.ts
var FetchCountyUseCase = class {
  constructor(countiesRepository) {
    this.countiesRepository = countiesRepository;
  }
  async execute({
    name,
    page
  }) {
    const counties = await this.countiesRepository.searchMany(
      name,
      page
    );
    return {
      counties
    };
  }
};

// src/use-cases/factories/make-fetch-county-use-case.ts
function makeFetchCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository();
  const fetchCountyUseCase = new FetchCountyUseCase(prismaCountyRepository);
  return fetchCountyUseCase;
}

// src/http/controllers/counties/fetch.ts
async function fetch5(request, reply) {
  const registerBodySchema = import_zod26.z.object({
    query: import_zod26.z.string().optional(),
    page: import_zod26.z.coerce.number().int().positive().optional()
  });
  const { query = "", page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchCountyUseCase = makeFetchCountyUseCase();
    let counties = await fetchCountyUseCase.execute({
      name: query,
      page
    });
    return reply.status(200).send(counties);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/county/get-county.ts
var GetCountyUseCase = class {
  constructor(countyRepository) {
    this.countyRepository = countyRepository;
  }
  async execute({
    countyId
  }) {
    const county = await this.countyRepository.findById(
      countyId
    );
    if (!county) {
      throw new CountyNotFoundError();
    }
    return {
      county
    };
  }
};

// src/use-cases/factories/make-get-county-use-case.ts
function makeGetCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository();
  const getCountyUseCase = new GetCountyUseCase(prismaCountyRepository);
  return getCountyUseCase;
}

// src/http/controllers/counties/get.ts
var import_zod27 = require("zod");
async function get4(request, reply) {
  const registerBodySchema = import_zod27.z.object({
    id: import_zod27.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const getCountyUseCase = makeGetCountyUseCase();
    const county = await getCountyUseCase.execute({
      countyId: id
    });
    return reply.send(county);
  } catch (err) {
    if (err instanceof CountyNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/counties/routes.ts
async function countiesRoutes(app2) {
  app2.post("/counties", create6);
  app2.get("/counties", fetch5);
  app2.delete("/counties/:id", destroy4);
  app2.get("/counties/:id", get4);
}

// src/http/controllers/users/fetch.ts
var import_zod28 = require("zod");

// src/use-cases/user/fetch-user.ts
var FetchUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    role,
    page
  }) {
    const users = await this.usersRepository.searchMany(
      role,
      page
    );
    return {
      users
    };
  }
};

// src/use-cases/factories/make-fetch-users-use-case.ts
function makeFetchUsersUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const fetchUserUseCase = new FetchUserUseCase(prismaUserRepository);
  return fetchUserUseCase;
}

// src/http/controllers/users/fetch.ts
var import_client9 = require("@prisma/client");
async function fetch6(request, reply) {
  const registerBodySchema = import_zod28.z.object({
    role: import_zod28.z.nativeEnum(import_client9.Role).default("STUDENT"),
    page: import_zod28.z.coerce.number().int().positive().optional()
  });
  const { role, page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchUserUseCase = makeFetchUsersUseCase();
    let users = await fetchUserUseCase.execute({
      role,
      page
    });
    return reply.status(200).send(users);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/errors/user-is-invalid-error.ts
var UserInvalidError = class extends Error {
  constructor() {
    super("User is invalid.");
  }
};

// src/use-cases/user/block-user.ts
var BlockUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    status
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    await this.usersRepository.blockUser(findUser.id, status);
  }
};

// src/use-cases/factories/make-block-user-use-case.ts
function makeBlockUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const blockUserUseCase = new BlockUserUseCase(prismaUserRepository);
  return blockUserUseCase;
}

// src/http/controllers/users/block.ts
var import_zod29 = require("zod");
async function blockUser(request, reply) {
  const registerBodySchema = import_zod29.z.object({
    status: import_zod29.z.boolean(),
    email: import_zod29.z.string()
  });
  const { email, status } = registerBodySchema.parse(request.body);
  try {
    const blockUserUseCase = makeBlockUserUseCase();
    await blockUserUseCase.execute({
      email,
      status
    });
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/user/reset-user-password.ts
var import_bcryptjs3 = __toESM(require("bcryptjs"));
var ResetUserPasswordUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    let newHashedPassword = await import_bcryptjs3.default.hash(password, 10);
    await this.usersRepository.resetUserPassword(findUser.id, newHashedPassword);
  }
};

// src/use-cases/factories/make-reset-user-password-use-case.ts
function makeResetUserPasswordUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const resetUserPasswordUseCase = new ResetUserPasswordUseCase(prismaUserRepository);
  return resetUserPasswordUseCase;
}

// src/http/controllers/users/reset-password.ts
var import_zod30 = require("zod");
async function resetPassword(request, reply) {
  const registerBodySchema = import_zod30.z.object({
    email: import_zod30.z.string(),
    password: import_zod30.z.string().default("123456")
  });
  const { email, password } = registerBodySchema.parse(request.body);
  try {
    const resetUserPasswordUseCase = makeResetUserPasswordUseCase();
    await resetUserPasswordUseCase.execute({
      email,
      password
    });
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

// src/use-cases/errors/user-not-found.ts
var UserNotFoundError = class extends Error {
  constructor() {
    super("User not found.");
  }
};

// src/use-cases/user/get-user.ts
var GetUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email
  }) {
    const user = await this.usersRepository.findByEmail(
      email
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    delete user.password;
    return {
      user
    };
  }
};

// src/use-cases/factories/make-get-user-use-case.ts
function makeGetUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const getUserUseCase = new GetUserUseCase(prismaUserRepository);
  return getUserUseCase;
}

// src/http/controllers/users/get.ts
var import_zod31 = require("zod");
async function get5(request, reply) {
  const registerBodySchema = import_zod31.z.object({
    email: import_zod31.z.string()
  });
  const { email } = registerBodySchema.parse(request.query);
  try {
    const getUserUseCase = makeGetUserUseCase();
    const user = await getUserUseCase.execute({
      email
    });
    return reply.send(user);
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/users/routes.ts
async function usersRoutes(app2) {
  app2.get("/users", fetch6);
  app2.get("/user", get5);
  app2.post("/users/block", blockUser);
  app2.post("/users/reset-password", resetPassword);
}

// src/http/controllers/employees/create.ts
var import_zod32 = require("zod");

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

// src/use-cases/factories/make-create-employee-use-case.ts
function makeCreateEmployeeUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository();
  return new CreateEmployeeUseCase(prismaEmployeeRepository);
}

// src/http/controllers/employees/create.ts
async function create7(request, reply) {
  const createBodySchema = import_zod32.z.object({
    fullName: import_zod32.z.string(),
    dateOfBirth: import_zod32.z.coerce.date(),
    emissionDate: import_zod32.z.coerce.date(),
    expirationDate: import_zod32.z.coerce.date(),
    gender: import_zod32.z.enum(["MALE", "FEMALE"]),
    identityCardNumber: import_zod32.z.string(),
    maritalStatus: import_zod32.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    phone: import_zod32.z.string(),
    residence: import_zod32.z.string(),
    alternativePhone: import_zod32.z.string().optional()
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
var import_zod33 = require("zod");

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
async function fetch7(request, reply) {
  const registerBodySchema = import_zod33.z.object({
    query: import_zod33.z.string().optional(),
    page: import_zod33.z.coerce.number().int().positive().optional()
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
var import_zod34 = require("zod");

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
  const updateBodySchema = import_zod34.z.object({
    fullName: import_zod34.z.string().optional(),
    dateOfBirth: import_zod34.z.coerce.date().optional(),
    emissionDate: import_zod34.z.coerce.date().optional(),
    expirationDate: import_zod34.z.coerce.date().optional(),
    gender: import_zod34.z.enum(["MALE", "FEMALE"]).optional(),
    identityCardNumber: import_zod34.z.string().optional(),
    maritalStatus: import_zod34.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
    phone: import_zod34.z.string().optional(),
    residence: import_zod34.z.string().optional(),
    alternativePhone: import_zod34.z.string().optional()
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
async function employeesRoutes(app2) {
  app2.put("/employees/:id", update);
  app2.get("/employees/:id", fetchById);
  app2.post("/employees", create7);
  app2.get("/employees", fetch7);
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
app.register(provincesRoutes, { prefix: "/api/v1" });
app.register(countiesRoutes, { prefix: "/api/v1" });
app.register(coursesRoutes, { prefix: "/api/v1" });
app.register(studentsRoutes, { prefix: "/api/v1" });
app.register(enrollmentsRoutes, { prefix: "/api/v1" });
app.register(documentsRoutes, { prefix: "/api/v1" });
app.register(photosRoutes, { prefix: "/api/v1" });
app.register(paymentsRoutes, { prefix: "/api/v1" });
app.register(notesRoutes, { prefix: "/api/v1" });
app.register(authRoutes, { prefix: "/api/v1" });
app.register(usersRoutes, { prefix: "/api/v1" });
app.register(employeesRoutes, { prefix: "/api/v1" });
app.setErrorHandler((error, _, reply) => {
  if (error instanceof import_zod35.ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
  return reply.status(500).send({ message: "Internal server error." });
});

// src/server.ts
var port = env.PORT || 3333;
app.listen({
  host: "0.0.0.0",
  port: Number(port)
}).then((address) => {
  console.log(`HTTP Server Running at ${address}`);
}).catch((error) => {
  console.error("Error starting server:", error);
});
