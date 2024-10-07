import { NotesRepository } from "@/repositories/notes-repository"
import { LevelName, Note } from "@prisma/client";
import { randomInt } from "crypto";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { SubjectNotFoundError } from "../errors/subject-not-found";
import { SubjectsRepository } from "@/repositories/subject-repository";

interface CreateNoteUseCaseRequest {
  pf1?: number;
  pf2?: number;
  pft?: number;
  ps1?: number;
  ps2?: number;
  pst?: number;
  pt1?: number;
  pt2?: number;
  ptt?: number;
  ims?: number;
  level: LevelName;
  nee?: number;
  resource?: number;
  mt1?: number | null;
  mt2?: number | null;
  mt3?: number | null;
  mfd?: number | null;
  mf?: number | null;
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
    private subjectsRepository: SubjectsRepository,

  ) { }

  async execute({
    pf1,
    pf2,
    pft,
    ps1,
    ps2,
    pst,
    pt1,
    pt2,
    ims,
    ptt,
    nee,
    resource,
    level,
    enrollmentId,
    subjectId
  }: CreateNoteUseCaseRequest): Promise<CreateNoteUseCaseResponse> {

    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId)
    const subject = await this.subjectsRepository.findById(subjectId)

    if (!subject) {
      throw new SubjectNotFoundError()
    }

    if (!enrollment) {
      throw new EnrollmentNotFoundError()
    }

    const note = await this.notesRepository.addNote({
      id: randomInt(99999),
      pf1,
      pf2,
      pft,
      ps1,
      ps2,
      pst,
      pt1,
      ims,
      pt2,
      ptt,
      nee,
      resource,
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
