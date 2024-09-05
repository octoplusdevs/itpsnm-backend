import { NotesRepository, notes } from "@/repositories/notes-repository"
import { Mester } from "@prisma/client";
import { randomInt } from "crypto";

interface CreateNoteUseCaseRequest {
  p1?: number;
  p2?: number;
  exam?: number;
  nee?: number;
  resource?: number;
  mester: Mester;
  studentId: number;
  subjectId: number;
}

interface CreateNoteUseCaseResponse {
  note: notes;
}

export class CreateNoteUseCase {
  constructor(private notesRepository: NotesRepository) {}

  async execute({
    p1 = 0,
    p2 = 0,
    exam = 0,
    nee = 0,
    resource = 0,
    mester,
    studentId,
    subjectId
  }: CreateNoteUseCaseRequest): Promise<CreateNoteUseCaseResponse> {

    const note = await this.notesRepository.addNote({
      id: randomInt(99999),
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      studentId,
      subjectId,
      created_at: new Date(),
      update_at: new Date(),
    });

    return {
      note,
    };
  }
}
