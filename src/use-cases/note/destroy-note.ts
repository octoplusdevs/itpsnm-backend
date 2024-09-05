import { NotesRepository } from "@/repositories/notes-repository"

interface DestroyNoteUseCaseRequest {
  id: number;
}

interface DestroyNoteUseCaseResponse {
  success: boolean;
}

export class DestroyNoteUseCase {
  constructor(private notesRepository: NotesRepository) { }

  async execute({
    id,
  }: DestroyNoteUseCaseRequest): Promise<DestroyNoteUseCaseResponse> {
    const success = await this.notesRepository.destroy(id);

    return {
      success,
    };
  }
}
