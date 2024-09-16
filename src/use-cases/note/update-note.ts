import { NotesRepository } from "@/repositories/notes-repository"
import { LevelName, Note } from "@prisma/client"

interface UpdateNoteUseCaseRequest {
  id?: number;
  pf1?: number;
  pf2?: number;
  pft?: number;
  ps1?: number;
  ps2?: number;
  pst?: number;
  pt1?: number;
  pt2?: number;
  ptt?: number;
  level?: LevelName;
  nee?: number;
  resource?: number;
  mt1?: number | null;
  mt2?: number | null;
  mt3?: number | null;
  mfd?: number | null;
  mf?: number | null;
  enrollmentId?: number;
  subjectId?: number;
}

interface UpdateNoteUseCaseResponse {
  note: Note | null;
}

export class UpdateNoteUseCase {
  constructor(private notesRepository: NotesRepository) { }

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
    id,
    nee,
    resource,
    enrollmentId,
    subjectId,
  }: UpdateNoteUseCaseRequest): Promise<UpdateNoteUseCaseResponse> {
    const updatedNote = await this.notesRepository.update(id!, {
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
    })

    return {
      note: updatedNote,
    }
  }
}
