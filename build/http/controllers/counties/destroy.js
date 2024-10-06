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

// src/http/controllers/counties/destroy.ts
var destroy_exports = {};
__export(destroy_exports, {
  destroy: () => destroy
});
module.exports = __toCommonJS(destroy_exports);

// src/use-cases/errors/county-not-found.ts
var CountyNotFoundError = class extends Error {
  constructor() {
    super("County not found.");
  }
};

// src/use-cases/errors/resource-not-found.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found.");
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
var import_zod2 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    id: import_zod2.z.coerce.number()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  destroy
});
