import { NotesRepository } from '@/repositories/notes-repository'
import { SearchManyNotesUseCase } from '../note/search-many'
import { PrismaNotesRepository } from '@/repositories/prisma/prisma-note-repository'

export function makeSearchManyNotesUseCase() {
  const notesRepository: NotesRepository = new PrismaNotesRepository()
  return new SearchManyNotesUseCase(notesRepository)
}
