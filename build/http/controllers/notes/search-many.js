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

// src/http/controllers/notes/search-many.ts
var search_many_exports = {};
__export(search_many_exports, {
  searchMany: () => searchMany
});
module.exports = __toCommonJS(search_many_exports);

// src/use-cases/note/search-many.ts
var SearchManyNotesUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    p1,
    p2,
    exam,
    nee,
    resource,
    mester,
    studentId,
    subjectId
  }) {
    const criteria = {
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      studentId,
      subjectId
    };
    const notes = await this.notesRepository.searchMany(criteria);
    return {
      notes
    };
  }
};

// src/repositories/prisma/prisma-note-repository.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
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
      return await prisma.note.create({
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
    }
    return await prisma.note.update({
      where: {
        id: findNote.id
      },
      data: {
        resource: data.resource ?? findNote.resource,
        pf1: data.pf1 ?? findNote.pf1,
        pf2: data.pf2 ?? findNote.pf2,
        pft: data.pft ?? findNote.pft,
        ps1: data.pf1 ?? findNote.ps1,
        ps2: data.pf2 ?? findNote.ps2,
        pst: data.pft ?? findNote.pst,
        pt1: data.pf1 ?? findNote.pt1,
        pt2: data.pf2 ?? findNote.pt2,
        ptt: data.pft ?? findNote.ptt,
        nee: data.nee ?? findNote.nee,
        level: data.level,
        update_at: /* @__PURE__ */ new Date()
      }
    });
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

// src/use-cases/factories/make-search-many-notes-use-case.ts
function makeSearchManyNotesUseCase() {
  const notesRepository = new PrismaNotesRepository();
  return new SearchManyNotesUseCase(notesRepository);
}

// src/http/controllers/notes/search-many.ts
var import_zod = require("zod");
async function searchMany(request, reply) {
  const searchManyBodySchema = import_zod.z.object({
    studentId: import_zod.z.number().optional(),
    subjectId: import_zod.z.number().optional(),
    mester: import_zod.z.enum(["FIRST", "SECOND", "THIRD"]).optional(),
    level: import_zod.z.enum(["CLASS_10", "CLASS_11", "CLASS_12", "CLASS_13"]).optional()
  });
  const criteria = searchManyBodySchema.parse(request.query);
  try {
    const searchManyNotesUseCase = makeSearchManyNotesUseCase();
    const notes = await searchManyNotesUseCase.execute(criteria);
    return reply.status(200).send({ notes });
  } catch (err) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchMany
});
