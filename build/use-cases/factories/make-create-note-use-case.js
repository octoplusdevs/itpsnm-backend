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

// src/use-cases/factories/make-create-note-use-case.ts
var make_create_note_use_case_exports = {};
__export(make_create_note_use_case_exports, {
  makeCreateNoteUseCase: () => makeCreateNoteUseCase
});
module.exports = __toCommonJS(make_create_note_use_case_exports);

// src/use-cases/note/add-note.ts
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
    pf1 = 0,
    pf2 = 0,
    pft = 0,
    ps1 = 0,
    ps2 = 0,
    pst = 0,
    pt1 = 0,
    pt2 = 0,
    ptt = 0,
    nee = 0,
    resource = 0,
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

// src/lib/prisma.ts
var import_client2 = require("@prisma/client");
var prisma2 = new import_client2.PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: ["query", "info", "warn", "error"]
});

// src/repositories/prisma/prisma-enrollments-repository.ts
var PrismaEnrollmentsRepository = class {
  async checkStatus(enrollmentId) {
    let enrollment = await prisma2.enrollment.findUnique({
      where: {
        id: enrollmentId
      },
      include: {
        students: {
          select: {
            fullName: true,
            id: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return enrollment;
  }
  async findByEnrollmentNumber(enrollmentId) {
    let enrollment = await prisma2.enrollment.findUnique({
      where: {
        id: enrollmentId
      }
    });
    return enrollment;
  }
  async findByIdentityCardNumber(identityCardNumber) {
    let enrollment = await prisma2.enrollment.findUnique({
      where: { identityCardNumber },
      include: {
        students: {
          select: {
            fullName: true,
            id: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return enrollment;
  }
  async toggleStatus(enrollmentId, docsState, paymentState) {
    let enrollment = await prisma2.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        docsState,
        paymentState
      }
    });
    return {
      ...enrollment,
      docsState: enrollment.docsState,
      paymentState: enrollment.paymentState
    };
  }
  async destroy(enrollmentId) {
    let isDeletedEnrollment = await prisma2.enrollment.delete({
      where: {
        id: enrollmentId
      }
    });
    return isDeletedEnrollment ? true : false;
  }
  //TODO: Mudar o retorno de any
  async create(data) {
    let enrollment = await prisma2.enrollment.create({
      data: {
        docsState: data.docsState,
        paymentState: data.paymentState,
        identityCardNumber: data.identityCardNumber,
        courseId: data.courseId,
        levelId: data.levelId,
        classeId: data.classeId
      }
    });
    return {
      ...enrollment,
      identityCardNumber: enrollment.identityCardNumber,
      levelId: enrollment.levelId,
      courseId: enrollment.courseId,
      classeId: enrollment.classeId
    };
  }
  async searchMany(paymentState, docsState, page) {
    let pageSize = 20;
    const totalItems = await prisma2.enrollment.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    let enrollments = await prisma2.enrollment.findMany({
      include: {
        students: {
          select: {
            dateOfBirth: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            fullName: true,
            countyId: true,
            alternativePhone: true,
            emissionDate: true,
            expirationDate: true,
            father: true,
            files: true,
            id: true,
            maritalStatus: true,
            mother: true,
            phone: true,
            provinceId: true,
            residence: true,
            type: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        },
        documents: {
          select: {
            id: true,
            File: true
          }
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        docsState,
        paymentState
      }
    });
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: enrollments
    };
  }
};

// src/repositories/prisma/prisma-subject-repository.ts
var PrismaSubjectRepository = class {
  async findByName(name) {
    const findSubject = await prisma2.subject.findUnique({
      where: {
        name
      }
    });
    return findSubject;
  }
  async create(data) {
    let newSubject = await prisma2.subject.create({
      data: {
        name: data.name
      }
    });
    return newSubject;
  }
  async searchMany(query, page) {
    let pageSize = 20;
    let courses = await prisma2.subject.findMany({
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
    let findSubject = await prisma2.subject.delete({
      where: {
        id
      }
    });
    return findSubject ? true : false;
  }
  async findById(id) {
    const subject = await prisma2.subject.findUnique({
      where: {
        id
      }
    });
    return subject;
  }
};

// src/use-cases/factories/make-create-note-use-case.ts
function makeCreateNoteUseCase() {
  const notesRepository = new PrismaNotesRepository();
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const subjectsRepository = new PrismaSubjectRepository();
  return new CreateNoteUseCase(notesRepository, enrollmentsRepository, subjectsRepository);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCreateNoteUseCase
});
