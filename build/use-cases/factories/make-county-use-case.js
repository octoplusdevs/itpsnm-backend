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

// src/use-cases/factories/make-county-use-case.ts
var make_county_use_case_exports = {};
__export(make_county_use_case_exports, {
  makeCountyUseCase: () => makeCountyUseCase
});
module.exports = __toCommonJS(make_county_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCountyUseCase
});
