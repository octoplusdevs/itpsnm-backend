import { NotesData, NotesRepository } from "@/repositories/notes-repository";

type GetNoteWithGradesUseCaseRequest =
  NotesData


interface GetNoteWithGradesUseCaseResponse {
  note: any | null;
}

export class GetNoteWithGradesUseCase {
  constructor(private notesRepository: NotesRepository) { }

  async execute(
    criteria
      : GetNoteWithGradesUseCaseRequest): Promise<GetNoteWithGradesUseCaseResponse> {
    const note = await this.notesRepository.getNoteWithFullGrades(criteria);

    return {
      note,
    };
  }
}
