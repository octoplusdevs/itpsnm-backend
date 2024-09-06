import { NotesRepository } from '@/repositories/notes-repository'
import { PrismaNotesRepository } from '@/repositories/prisma/prisma-note-repository'
import { GetNoteWithGradesUseCase } from '../note/get-notes-with-grades'

export function makeGetNoteWithFullGradesUseCase() {
  const notesRepository: NotesRepository = new PrismaNotesRepository()
  return new GetNoteWithGradesUseCase(notesRepository)
}
