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

// src/http/controllers/auth/register.ts
var register_exports = {};
__export(register_exports, {
  registerController: () => registerController
});
module.exports = __toCommonJS(register_exports);
var import_zod2 = require("zod");

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

// src/use-cases/authenticate/register.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = require("jsonwebtoken");

// src/use-cases/errors/employee-not-found.ts
var EmployeeNotFoundError = class extends Error {
  constructor() {
    super("Employee not found.");
  }
};

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
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
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId: existingStudent?.id
    });
    const token = (0, import_jsonwebtoken.sign)(
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

// src/http/controllers/auth/register.ts
async function registerController(request, reply) {
  const registerSchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    employeeId: import_zod2.z.number().optional(),
    enrollmentId: import_zod2.z.number().optional(),
    password: import_zod2.z.string().min(6),
    // Definindo uma senha com no mínimo 6 caracteres
    role: import_zod2.z.enum(["STUDENT", "ADMIN", "TEACHER"])
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerController
});
