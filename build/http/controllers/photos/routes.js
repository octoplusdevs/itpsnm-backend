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

// src/http/controllers/photos/routes.ts
var routes_exports = {};
__export(routes_exports, {
  photosRoutes: () => photosRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/photos/upload.ts
var import_client2 = require("@prisma/client");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_zod2 = require("zod");
var import_util = require("util");
var import_stream = require("stream");

// src/use-cases/file/create-file.ts
var CreateFileUseCase = class {
  constructor(filesRepository) {
    this.filesRepository = filesRepository;
  }
  async execute({ name, path: path2, format, type, identityCardNumber, documentId }) {
    const file = await this.filesRepository.create({
      name,
      path: path2,
      format,
      type,
      identityCardNumber,
      documentId
    });
    return file;
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

// src/use-cases/factories/make-file-use-case.ts
function makeCreateFileUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository();
  const createFileUseCase = new CreateFileUseCase(prismaFilesRepository);
  return createFileUseCase;
}

// src/http/controllers/photos/upload.ts
var pump = (0, import_util.promisify)(import_stream.pipeline);
async function upload(request, reply) {
  const fileSchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    format: import_zod2.z.nativeEnum(import_client2.FileFormat),
    identityCardNumber: import_zod2.z.string()
  });
  const uploadDir = import_path.default.join(__dirname, "..", "..", "..", "..", "uploads/photos");
  if (!import_fs.default.existsSync(uploadDir)) {
    import_fs.default.mkdirSync(uploadDir, { recursive: true });
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
        const filepath = import_path.default.join(uploadDir, filename);
        await pump(part.file, import_fs.default.createWriteStream(filepath));
        if (identityCardNumber === void 0) {
          return reply.status(400).send({ message: "identityCardNumber is required" });
        }
        file = {
          name: filename,
          path: filepath,
          format: part.mimetype === "image/jpeg" ? import_client2.FileFormat.JPEG : import_client2.FileFormat.PNG,
          type: import_client2.FileType.PHOTO,
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
async function photosRoutes(app) {
  app.post("/uploads/photos", upload);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  photosRoutes
});
