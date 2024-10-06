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

// src/http/controllers/counties/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  fetch: () => fetch
});
module.exports = __toCommonJS(fetch_exports);
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
async function fetch(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    query: import_zod2.z.string().optional(),
    page: import_zod2.z.coerce.number().int().positive().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetch
});
