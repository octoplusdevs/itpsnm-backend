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

// src/http/controllers/enrollments/get.ts
var get_exports = {};
__export(get_exports, {
  get: () => get
});
module.exports = __toCommonJS(get_exports);
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

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

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
  const createEnrollmentSchema = import_zod2.z.object({
    enrollmentNumber: import_zod2.z.coerce.number().optional(),
    identityCardNumber: import_zod2.z.coerce.string().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get
});
