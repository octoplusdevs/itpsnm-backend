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

// src/http/controllers/provinces/get.ts
var get_exports = {};
__export(get_exports, {
  get: () => get
});
module.exports = __toCommonJS(get_exports);

// src/use-cases/errors/province-not-found.ts
var ProvinceNotFoundError = class extends Error {
  constructor() {
    super("Province not found.");
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
var import_zod2 = require("zod");
async function get(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    id: import_zod2.z.coerce.number()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get
});
