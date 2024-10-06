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

// src/use-cases/factories/make-fetch-course-use-case.ts
var make_fetch_course_use_case_exports = {};
__export(make_fetch_course_use_case_exports, {
  makeFetchCourseUseCase: () => makeFetchCourseUseCase
});
module.exports = __toCommonJS(make_fetch_course_use_case_exports);

// src/use-cases/course/fetch-course.ts
var FetchCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    name,
    page
  }) {
    const courses = await this.coursesRepository.searchMany(
      name,
      page
    );
    return {
      courses
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

// src/use-cases/factories/make-fetch-course-use-case.ts
function makeFetchCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const fetchCourseUseCase = new FetchCourseUseCase(prismaCoursesRepository);
  return fetchCourseUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeFetchCourseUseCase
});
