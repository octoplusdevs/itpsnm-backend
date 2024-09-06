import { NotesData, NotesRepository } from "@/repositories/notes-repository"
import { Mester } from "@prisma/client"

interface SearchManyNotesUseCaseRequest {
  p1?: number;
  p2?: number;
  exam?: number;
  nee?: number;
  resource?: number;
  mester?: Mester;
  studentId?: number;
  subjectId?: number;
}

interface SearchManyNotesUseCaseResponse {
  notes: NotesData[];
}

export class SearchManyNotesUseCase {
  constructor(private notesRepository: NotesRepository) { }

  async execute({
    p1,
    p2,
    exam,
    nee,
    resource,
    mester,
    studentId,
    subjectId,
  }: SearchManyNotesUseCaseRequest): Promise<SearchManyNotesUseCaseResponse> {
    const criteria = {
      p1,
      p2,
      exam,
      nee,
      resource,
      mester,
      studentId,
      subjectId,
    };

    const notes = await this.notesRepository.searchMany(criteria);

    return {
      notes,
    };
  }
}
