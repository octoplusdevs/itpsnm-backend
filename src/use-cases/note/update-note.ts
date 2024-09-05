import { NotesRepository } from "@/repositories/notes-repository"
import { Mester, Note } from "@prisma/client"

interface UpdateNoteUseCaseRequest {
  id: number;
  p1?: number;
  p2?: number;
  exam?: number;
  nee?: number;
  resource?: number;
  mester?: Mester;
  studentId?: number;
  subjectId?: number;
}

interface UpdateNoteUseCaseResponse {
  note: Note | null;
}

export class UpdateNoteUseCase {
  constructor(private notesRepository: NotesRepository) {}

  async execute({
    id,
    p1,
    p2,
    exam,
    nee,
    resource,
    mester,
    studentId,
    subjectId,
  }: UpdateNoteUseCaseRequest): Promise<UpdateNoteUseCaseResponse> {
    const updatedNote = await this.notesRepository.update(id, {
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      studentId,
      subjectId,
    })

    return {
      note: updatedNote,
    }
  }
}
