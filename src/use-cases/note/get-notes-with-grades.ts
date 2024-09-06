import { NotesRepository } from "@/repositories/notes-repository";
import { LevelName } from "@prisma/client";

interface GetNoteWithGradesUseCaseRequest {
  studentId: number;
  classLevel: LevelName;
}

interface GetNoteWithGradesUseCaseResponse {
  note: any | null;
}

export class GetNoteWithGradesUseCase {
  constructor(private notesRepository: NotesRepository) { }

  async execute({
    studentId,
    classLevel,
  }: GetNoteWithGradesUseCaseRequest): Promise<GetNoteWithGradesUseCaseResponse> {
    const note = await this.notesRepository.getNoteWithFullGrades(studentId, classLevel);

    return {
      note,
    };
  }
}
