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

// src/http/controllers/notes/get-note-with-full-grades.ts
var get_note_with_full_grades_exports = {};
__export(get_note_with_full_grades_exports, {
  getNoteWithFullGrades: () => getNoteWithFullGrades
});
module.exports = __toCommonJS(get_note_with_full_grades_exports);

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
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

// src/repositories/prisma/prisma-note-repository.ts
var PrismaNotesRepository = class {
  async addNote(data) {
    const findNote = await prisma.note.findFirst({
      where: {
        level: data.level,
        enrollmentId: data.enrollmentId,
        subjectId: data.subjectId
      }
    });
    if (!findNote) {
      const newNote = await prisma.note.create({
        data: {
          pf1: data.pf1 ?? 0,
          pf2: data.pf2 ?? 0,
          pft: data.pft ?? 0,
          ps1: data.ps1 ?? 0,
          ps2: data.ps2 ?? 0,
          pst: data.pst ?? 0,
          pt1: data.pt1 ?? 0,
          pt2: data.pt2 ?? 0,
          ptt: data.ptt ?? 0,
          nee: data.nee ?? 0,
          resource: data.resource ?? 0,
          level: data.level,
          enrollmentId: data.enrollmentId,
          subjectId: data.subjectId,
          created_at: data.created_at ?? /* @__PURE__ */ new Date(),
          update_at: /* @__PURE__ */ new Date()
        }
      });
      return newNote;
    }
    const updated = await prisma.note.update({
      where: {
        id: findNote.id
      },
      data: {
        resource: data.resource ?? findNote.resource,
        pf1: data.pf1 ?? findNote.pf1,
        pf2: data.pf2 ?? findNote.pf2,
        pft: data.pft ?? findNote.pft,
        ps1: data.ps1 ?? findNote.ps1,
        ps2: data.ps2 ?? findNote.ps2,
        pst: data.pst ?? findNote.pst,
        pt1: data.pt1 ?? findNote.pt1,
        pt2: data.pt2 ?? findNote.pt2,
        ptt: data.ptt ?? findNote.ptt,
        nee: data.nee ?? findNote.nee,
        level: data.level,
        update_at: /* @__PURE__ */ new Date()
      }
    });
    return updated;
  }
  async update(id, data) {
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...data,
        update_at: /* @__PURE__ */ new Date()
      }
    }).catch(() => null);
    return note;
  }
  async destroy(id) {
    try {
      await prisma.note.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
  async searchMany(criteria) {
    const notes = await prisma.note.findMany({
      where: criteria
    });
    return notes;
  }
  async getNoteWithFullGrades(criteria) {
    const notes = await prisma.note.findMany({
      where: {
        enrollmentId: criteria.enrollmentId,
        OR: [
          {
            level: criteria.level,
            subjectId: criteria.subjectId
          }
        ]
      },
      include: {
        enrollments: false,
        // Inclui os dados do estudante
        subjects: true
        // Inclui os dados da disciplina
      }
    });
    if (!notes.length)
      return null;
    return notes;
  }
};

// src/use-cases/note/get-notes-with-grades.ts
var GetNoteWithGradesUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute(criteria) {
    const note = await this.notesRepository.getNoteWithFullGrades(criteria);
    return {
      note
    };
  }
};

// src/use-cases/factories/make-get-note-with-full-grades-use-case.ts
function makeGetNoteWithFullGradesUseCase() {
  const notesRepository = new PrismaNotesRepository();
  return new GetNoteWithGradesUseCase(notesRepository);
}

// src/http/controllers/notes/get-note-with-full-grades.ts
var import_client2 = require("@prisma/client");
var import_zod2 = require("zod");
async function getNoteWithFullGrades(request, reply) {
  const getNoteWithFullGradesParamsSchema = import_zod2.z.object({
    enrollmentId: import_zod2.z.coerce.number()
  });
  const getNoteWithFullGradesQueriesSchema = import_zod2.z.object({
    level: import_zod2.z.nativeEnum(import_client2.LevelName).optional(),
    // Use z.nativeEnum para enums
    resource: import_zod2.z.coerce.number().optional(),
    // Use z.nativeEnum para enums
    subjectId: import_zod2.z.coerce.number().optional()
    // Use z.nativeEnum para enums
  });
  const { level, subjectId } = getNoteWithFullGradesQueriesSchema.parse(request.query);
  const { enrollmentId } = getNoteWithFullGradesParamsSchema.parse(request.params);
  try {
    const getNoteWithFullGradesUseCase = makeGetNoteWithFullGradesUseCase();
    const { note } = await getNoteWithFullGradesUseCase.execute({
      enrollmentId,
      level,
      subjectId
    });
    return reply.status(200).send({
      notes: note
    });
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNoteWithFullGrades
});
