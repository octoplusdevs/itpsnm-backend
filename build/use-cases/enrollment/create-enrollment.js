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

// src/use-cases/enrollment/create-enrollment.ts
var create_enrollment_exports = {};
__export(create_enrollment_exports, {
  CreateEnrollmentUseCase: () => CreateEnrollmentUseCase
});
module.exports = __toCommonJS(create_enrollment_exports);

// src/use-cases/errors/course-not-found.ts
var CourseNotFoundError = class extends Error {
  constructor() {
    super("Course not found.");
  }
};

// src/use-cases/errors/level-not-found.ts
var LevelNotFoundError = class extends Error {
  constructor() {
    super("Level not found.");
  }
};

// src/use-cases/errors/enrollment-already-exists.ts
var EnrollmentAlreadyExistsError = class extends Error {
  constructor() {
    super("Enrollment already exists error.");
  }
};

// src/use-cases/enrollment/create-enrollment.ts
var import_crypto = require("crypto");

// src/use-cases/errors/student-not-found.ts
var StudentNotFoundError = class extends Error {
  constructor() {
    super("Student not found.");
  }
};

// src/use-cases/enrollment/create-enrollment.ts
var CreateEnrollmentUseCase = class {
  constructor(levelsRepository, coursesRepository, enrollmentRepository, studentRepository) {
    this.levelsRepository = levelsRepository;
    this.coursesRepository = coursesRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.studentRepository = studentRepository;
  }
  async execute({
    id,
    paymentState,
    docsState,
    identityCardNumber,
    levelId,
    courseId,
    created_at,
    update_at
  }) {
    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }
    const level = await this.levelsRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError();
    }
    const student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
    if (!student) {
      throw new StudentNotFoundError();
    }
    const existingEnrollment = await this.enrollmentRepository.findByIdentityCardNumber(identityCardNumber);
    if (existingEnrollment) {
      throw new EnrollmentAlreadyExistsError();
    }
    const enrollment = await this.enrollmentRepository.create({
      id: id ?? (0, import_crypto.randomInt)(9999),
      docsState: docsState ?? "PENDING",
      paymentState: paymentState ?? "PENDING",
      identityCardNumber,
      classeId: null,
      courseId,
      levelId,
      created_at: created_at ?? /* @__PURE__ */ new Date(),
      update_at: update_at ?? /* @__PURE__ */ new Date()
    });
    return {
      enrollment
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateEnrollmentUseCase
});
