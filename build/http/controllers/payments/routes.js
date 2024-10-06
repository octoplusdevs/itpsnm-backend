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

// src/http/controllers/payments/routes.ts
var routes_exports = {};
__export(routes_exports, {
  paymentsRoutes: () => paymentsRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

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

// src/http/controllers/payments/upload.ts
var import_client2 = require("@prisma/client");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_zod2 = require("zod");
var import_util = require("util");
var import_stream = require("stream");
var pump = (0, import_util.promisify)(import_stream.pipeline);
async function payment(request, reply) {
  const fileSchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    format: import_zod2.z.nativeEnum(import_client2.FileFormat),
    type: import_zod2.z.nativeEnum(import_client2.FileType),
    studentId: import_zod2.z.number()
  });
  const createDocumentWithFilesSchema = import_zod2.z.object({
    enrollmentId: import_zod2.z.number(),
    files: import_zod2.z.array(fileSchema).nonempty()
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

// src/http/controllers/payments/routes.ts
async function paymentsRoutes(app) {
  app.post("/payments/enrollments", payment);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  paymentsRoutes
});
