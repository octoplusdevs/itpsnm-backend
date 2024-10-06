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

// src/http/controllers/courses/destroy.ts
var destroy_exports = {};
__export(destroy_exports, {
  destroy: () => destroy
});
module.exports = __toCommonJS(destroy_exports);

// src/use-cases/errors/course-not-found.ts
var CourseNotFoundError = class extends Error {
  constructor() {
    super("Course not found.");
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

// src/repositories/prisma/prisma-course-repository.ts
var PrismaCoursesRepository = class {
  async findByName(name) {
    const findCourse = await prisma.course.findUnique({
      where: {
        name
      }
    });
    return findCourse;
  }
  async create(data) {
    let newCourse = await prisma.course.create({
      data: {
        name: data.name
      }
    });
    return newCourse;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let courses = await prisma.course.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    return courses;
  }
  async destroy(id) {
    let findCourse = await prisma.course.delete({
      where: {
        id
      }
    });
    return findCourse ? true : false;
  }
  async findById(id) {
    const course = await prisma.course.findUnique({
      where: {
        id
      }
    });
    return course;
  }
};

// src/use-cases/course/destroy-course.ts
var DestroyCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    id
  }) {
    const findCourse = await this.coursesRepository.findById(id);
    if (!findCourse) {
      throw new CourseNotFoundError();
    }
    return await this.coursesRepository.destroy(
      id
    );
  }
};

// src/use-cases/factories/make-destroy-course-use-case.ts
function makeDestroyCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const destroyCourseUseCase = new DestroyCourseUseCase(prismaCoursesRepository);
  return destroyCourseUseCase;
}

// src/http/controllers/courses/destroy.ts
var import_zod2 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    id: import_zod2.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const courseUseCase = makeDestroyCourseUseCase();
    await courseUseCase.execute({
      id
    });
  } catch (err) {
    if (err instanceof CourseNotFoundError) {
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
