import { NotesData, NotesRepository } from "@/repositories/notes-repository"

interface SearchManyNotesUseCaseRequest {
  p1?: number;
  p2?: number;
  exam?: number;
  nee?: number;
  resource?: number;
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
    studentId,
    subjectId,
  }: SearchManyNotesUseCaseRequest): Promise<SearchManyNotesUseCaseResponse> {
    const criteria = {
      p1,
      p2,
      exam,
      nee,
      resource,
      studentId,
      subjectId,
    };

    const notes = await this.notesRepository.searchMany(criteria);

    return {
      notes,
    };
  }
}
