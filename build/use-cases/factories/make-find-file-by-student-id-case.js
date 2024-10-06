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

// src/use-cases/factories/make-find-file-by-student-id-case.ts
var make_find_file_by_student_id_case_exports = {};
__export(make_find_file_by_student_id_case_exports, {
  makeGetFileByStudentIdUseCase: () => makeGetFileByStudentIdUseCase
});
module.exports = __toCommonJS(make_find_file_by_student_id_case_exports);

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

// src/use-cases/file/get-file-by-student-id.ts
var GetFilesByStudentsIdentityCardNumberUseCase = class {
  constructor(filesRepository) {
    this.filesRepository = filesRepository;
  }
  async execute({ identityCardNumber }) {
    const files = await this.filesRepository.findAllFilesStudentByIdentityCardNumber(identityCardNumber);
    return files;
  }
};

// src/use-cases/factories/make-find-file-by-student-id-case.ts
function makeGetFileByStudentIdUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository();
  const getFileUseCase = new GetFilesByStudentsIdentityCardNumberUseCase(prismaFilesRepository);
  return getFileUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeGetFileByStudentIdUseCase
});
