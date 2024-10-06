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

// src/http/controllers/provinces/fetch.ts
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
async function fetch(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    query: import_zod2.z.string().optional(),
    page: import_zod2.z.coerce.number().int().positive().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetch
});
