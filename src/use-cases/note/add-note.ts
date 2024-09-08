import { NotesRepository } from "@/repositories/notes-repository"
import { LevelName, Mester, Note } from "@prisma/client";
import { randomInt } from "crypto";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { prisma } from "@/lib/prisma";
import { SubjectNotFoundError } from "../errors/subject-not-found";

interface CreateNoteUseCaseRequest {
  p1?: number;
  p2?: number;
  exam?: number;
  level: LevelName;
  nee?: number;
  resource?: number;
  mester: Mester;
  enrollmentId: number;
  subjectId: number;
}

interface CreateNoteUseCaseResponse {
  note: Note;
}

export class CreateNoteUseCase {
  constructor(
    private notesRepository: NotesRepository,
    private enrollmentsRepository: EnrollmentsRepository,

  ) { }

  async execute({
    p1 = 0,
    p2 = 0,
    exam = 0,
    nee = 0,
    resource = 0,
    mester,
    level,
    enrollmentId,
    subjectId
  }: CreateNoteUseCaseRequest): Promise<CreateNoteUseCaseResponse> {

    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId)
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } })

    if (!subject) {
      throw new SubjectNotFoundError()
    }

    if (!enrollment) {
      throw new EnrollmentNotFoundError()
    }

    const note = await this.notesRepository.addNote({
      id: randomInt(99999),
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      enrollmentId,
      subjectId,
      created_at: new Date(),
      update_at: new Date(),
      level
    });

    return {
      note,
    };
  }
}
