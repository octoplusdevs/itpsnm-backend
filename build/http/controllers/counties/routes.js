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

// src/http/controllers/counties/routes.ts
var routes_exports = {};
__export(routes_exports, {
  countiesRoutes: () => countiesRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/use-cases/errors/county-already-exists-error.ts
var CountyAlreadyExistsError = class extends Error {
  constructor() {
    super("County already exists.");
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

// src/http/controllers/counties/create.ts
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    name: import_zod2.z.string()
  });
  const { name } = registerBodySchema.parse(request.body);
  try {
    const countyUseCase = makeCountyUseCase();
    await countyUseCase.execute({
      name
    });
  } catch (err) {
    if (err instanceof CountyAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

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
var import_zod3 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    id: import_zod3.z.coerce.number()
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

// src/http/controllers/counties/fetch.ts
var import_zod4 = require("zod");

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
  const registerBodySchema = import_zod4.z.object({
    query: import_zod4.z.string().optional(),
    page: import_zod4.z.coerce.number().int().positive().optional()
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

// src/use-cases/county/get-county.ts
var GetCountyUseCase = class {
  constructor(countyRepository) {
    this.countyRepository = countyRepository;
  }
  async execute({
    countyId
  }) {
    const county = await this.countyRepository.findById(
      countyId
    );
    if (!county) {
      throw new CountyNotFoundError();
    }
    return {
      county
    };
  }
};

// src/use-cases/factories/make-get-county-use-case.ts
function makeGetCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository();
  const getCountyUseCase = new GetCountyUseCase(prismaCountyRepository);
  return getCountyUseCase;
}

// src/http/controllers/counties/get.ts
var import_zod5 = require("zod");
async function get(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    id: import_zod5.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const getCountyUseCase = makeGetCountyUseCase();
    const county = await getCountyUseCase.execute({
      countyId: id
    });
    return reply.send(county);
  } catch (err) {
    if (err instanceof CountyNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/counties/routes.ts
async function countiesRoutes(app) {
  app.post("/counties", create);
  app.get("/counties", fetch);
  app.delete("/counties/:id", destroy);
  app.get("/counties/:id", get);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countiesRoutes
});
