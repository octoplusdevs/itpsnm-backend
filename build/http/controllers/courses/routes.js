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

// src/http/controllers/courses/routes.ts
var routes_exports = {};
__export(routes_exports, {
  coursesRoutes: () => coursesRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/use-cases/errors/course-already-exists-error.ts
var CourseAlreadyExistsError = class extends Error {
  constructor() {
    super("Course name already exists.");
  }
};

// src/use-cases/course/create-course.ts
var CreateCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    name
  }) {
    const findCourse = await this.coursesRepository.findByName(name);
    if (findCourse) {
      throw new CourseAlreadyExistsError();
    }
    const course = await this.coursesRepository.create({
      name
    });
    return {
      course
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

// src/use-cases/factories/make-course-use-case.ts
function makeCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const createCourseUseCase = new CreateCourseUseCase(prismaCoursesRepository);
  return createCourseUseCase;
}

// src/http/controllers/courses/create.ts
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    name: import_zod2.z.string()
  });
  const { name } = registerBodySchema.parse(request.body);
  try {
    const courseUseCase = makeCourseUseCase();
    await courseUseCase.execute({
      name
    });
  } catch (err) {
    if (err instanceof CourseAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
  return reply.status(201).send();
}

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
var import_zod3 = require("zod");
async function destroy(request, reply) {
  const registerBodySchema = import_zod3.z.object({
    id: import_zod3.z.coerce.number()
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

// src/http/controllers/courses/fetch.ts
var import_zod4 = require("zod");

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

// src/use-cases/factories/make-fetch-course-use-case.ts
function makeFetchCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const fetchCourseUseCase = new FetchCourseUseCase(prismaCoursesRepository);
  return fetchCourseUseCase;
}

// src/http/controllers/courses/fetch.ts
async function fetch(request, reply) {
  const registerBodySchema = import_zod4.z.object({
    query: import_zod4.z.string().optional(),
    page: import_zod4.z.coerce.number().int().positive().optional()
  });
  const { query = "", page = 1 } = registerBodySchema.parse(request.query);
  try {
    const fetchCourseUseCase = makeFetchCourseUseCase();
    let enrollments = await fetchCourseUseCase.execute({
      name: query,
      page
    });
    return reply.status(200).send(enrollments);
  } catch (err) {
    return reply.status(500).send(err);
  }
}

// src/use-cases/course/get-course.ts
var GetCourseUseCase = class {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }
  async execute({
    courseId
  }) {
    const course = await this.coursesRepository.findById(
      courseId
    );
    if (!course) {
      throw new CourseNotFoundError();
    }
    return {
      course
    };
  }
};

// src/use-cases/factories/make-get-course-use-case.ts
function makeGetCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository();
  const getCourseUseCase = new GetCourseUseCase(prismaCoursesRepository);
  return getCourseUseCase;
}

// src/http/controllers/courses/get.ts
var import_zod5 = require("zod");
async function get(request, reply) {
  const registerBodySchema = import_zod5.z.object({
    id: import_zod5.z.coerce.number()
  });
  const { id } = registerBodySchema.parse(request.params);
  try {
    const getCourseUseCase = makeGetCourseUseCase();
    const course = await getCourseUseCase.execute({
      courseId: id
    });
    return reply.send(course);
  } catch (err) {
    if (err instanceof CourseNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}

// src/http/controllers/courses/routes.ts
async function coursesRoutes(app) {
  app.post("/courses", create);
  app.get("/courses", fetch);
  app.delete("/courses/:id", destroy);
  app.get("/courses/:id", get);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  coursesRoutes
});
