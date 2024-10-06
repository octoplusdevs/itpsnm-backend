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

// src/use-cases/note/add-note.ts
var add_note_exports = {};
__export(add_note_exports, {
  CreateNoteUseCase: () => CreateNoteUseCase
});
module.exports = __toCommonJS(add_note_exports);
var import_crypto = require("crypto");

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/errors/subject-not-found.ts
var SubjectNotFoundError = class extends Error {
  constructor() {
    super("Subject not found.");
  }
};

// src/use-cases/note/add-note.ts
var CreateNoteUseCase = class {
  constructor(notesRepository, enrollmentsRepository, subjectsRepository) {
    this.notesRepository = notesRepository;
    this.enrollmentsRepository = enrollmentsRepository;
    this.subjectsRepository = subjectsRepository;
  }
  async execute({
    pf1,
    pf2,
    pft,
    ps1,
    ps2,
    pst,
    pt1,
    pt2,
    ptt,
    nee,
    resource,
    level,
    enrollmentId,
    subjectId
  }) {
    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId);
    const subject = await this.subjectsRepository.findById(subjectId);
    if (!subject) {
      throw new SubjectNotFoundError();
    }
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }
    const note = await this.notesRepository.addNote({
      id: (0, import_crypto.randomInt)(99999),
      pf1,
      pf2,
      pft,
      ps1,
      ps2,
      pst,
      pt1,
      pt2,
      ptt,
      nee,
      resource,
      enrollmentId,
      subjectId,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date(),
      level
    });
    return {
      note
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateNoteUseCase
});
